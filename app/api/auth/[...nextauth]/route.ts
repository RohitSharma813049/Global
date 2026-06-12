// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/superbaseconfig";

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
          const { data } = await supabaseAdmin.auth.admin.createUser({
            email: profile.email,
            email_confirm: true,
            user_metadata: {
              name: profile.name,
              role: "user",
            }
          });
          if (data.user) supabaseUser = data.user;
        }

        return {
          id: supabaseUser?.id || profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: supabaseUser?.user_metadata?.role || "user"
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
        
        return {
          id: credentials.email, 
          email: credentials.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };