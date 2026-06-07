// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession } from "next-auth";
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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
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

        if (!storedOtp || storedOtp !== credentials.otp) {
          throw new Error("Invalid or expired OTP");
        }

        // OTP is valid. Now we need to fetch or create the user in Supabase.
        // For simplicity, we just look up the user by email or let them in.
        // NextAuth will handle creating the session token.
        // To keep it strictly tied to Supabase, we could use the service role key to get the user ID,
        // but returning the email is enough for NextAuth session.
        
        await redis.del(`otp:${credentials.email}`); // Consume OTP
        
        return {
          id: credentials.email, // using email as ID if user not in Supabase yet, or we could fetch it.
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
});

export { handler as GET, handler as POST };