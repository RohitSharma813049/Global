// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/superbaseconfig";
import { generateDisplayId } from "@/lib/generate-id";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      async profile(profile) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );

        // Find or create user in Supabase to get a valid UUID
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        let supabaseUser = users.find(u => u.email === profile.email);

        if (!supabaseUser) {
          // Generate a complex random password that the user doesn't know, so they can use "Forgot Password" later if needed
          const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10).toUpperCase() + "1!Aa";
          const username = (profile.email?.split('@')[0] || "user") + Math.floor(Math.random() * 10000);

          const { data } = await supabaseAdmin.auth.admin.createUser({
            email: profile.email,
            password: randomPassword,
            email_confirm: true,
            user_metadata: {
              name: profile.name,
              first_name: profile.given_name || profile.name?.split(' ')[0] || '',
              last_name: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
              username: username,
              role: "reader",
              avatar_url: profile.picture,
            }
          });
          if (data.user) supabaseUser = data.user;
          
          // Also ensure a profile record exists in our public schema
          try {
            const { prisma } = await import("@/lib/db");
            const existingProfile = await prisma.profiles.findUnique({ where: { id: supabaseUser?.id } });
            if (!existingProfile && supabaseUser?.id) {
              await prisma.profiles.create({
                data: {
                  id: supabaseUser.id,
                  role: "reader",
                  display_id: generateDisplayId("reader")
                }
              });
            }
          } catch (err) {
            console.error("Error creating profile record for Google user:", err);
          }
        } else if (profile.picture && !supabaseUser.user_metadata?.avatar_url && !supabaseUser.user_metadata?.picture) {
          // If the user exists but doesn't have an avatar in metadata, update it
          const { data } = await supabaseAdmin.auth.admin.updateUserById(supabaseUser.id, {
            user_metadata: { ...supabaseUser.user_metadata, avatar_url: profile.picture }
          });
          if (data.user) supabaseUser = data.user;
        }

        return {
          id: supabaseUser?.id || profile.sub,
          name: profile.name,
          email: profile.email,
          image: supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture || profile.picture,
          role: supabaseUser?.user_metadata?.role || "reader"
        };
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Invalid credentials");
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || null,
          image: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
          role: data.user.user_metadata?.role || "user",
        };
      }
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        // Verify OTP from Redis
        const { redis } = await import("@/lib/redis");
        const storedOtp = await redis.get(`otp:${credentials.email}`);

        if (!storedOtp || String(storedOtp) !== String(credentials.otp)) {
          throw new Error("Invalid or expired OTP");
        }

        await redis.del(`otp:${credentials.email}`); // Consume OTP
        
        // Find or create user in Supabase to get a valid UUID
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );

        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        let supabaseUser = users.find(u => u.email === credentials.email);

        if (!supabaseUser) {
          const { data } = await supabaseAdmin.auth.admin.createUser({
            email: credentials.email,
            email_confirm: true,
            user_metadata: {
              role: "user",
            }
          });
          if (data.user) supabaseUser = data.user;
        }

        if (!supabaseUser) {
          throw new Error("Could not find or create user record");
        }
        
        return {
          id: supabaseUser.id, 
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
          role: supabaseUser.user_metadata?.role || "user",
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        if (user.image) token.picture = user.image;
      }
      if (trigger === "update") {
        if (session?.image) {
          token.picture = session.image;
        }
        if (session?.role) {
          token.role = session.role;
        }

        if (token.id && !session?.image && !session?.role) {
          // Force sync with database only if no specific image was provided
          try {
            const { createClient } = require('@supabase/supabase-js');
            const supabaseAdmin = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL || '',
              process.env.SUPABASE_SERVICE_ROLE_KEY || ''
            );
            const { data: userData } = await supabaseAdmin.auth.admin.getUserById(token.id as string);
            if (userData?.user?.user_metadata?.avatar_url) {
              token.picture = userData.user.user_metadata.avatar_url;
            }
            if (userData?.user?.user_metadata?.name) {
              token.name = userData.user.user_metadata.name;
            }
            if (userData?.user?.user_metadata?.role) {
              token.role = userData.user.user_metadata.role;
            }
          } catch (e) {
            console.error("Failed to sync session with DB on update", e);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };