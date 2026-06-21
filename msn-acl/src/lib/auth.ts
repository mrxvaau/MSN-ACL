import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "127.0.0.1";

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        const email = credentials.email;

        // Check Rate Limiting
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        
        // Get recent logs for this IP + Email
        const recentLogs = await prisma.adminLoginLog.findMany({
          where: {
            email,
            ipAddress,
            timestamp: { gte: fifteenMinutesAgo },
          },
          orderBy: { timestamp: "desc" },
        });

        // Count consecutive failures before a success
        let consecutiveFailures = 0;
        for (const log of recentLogs) {
          if (log.success) {
            break;
          }
          consecutiveFailures++;
        }

        if (consecutiveFailures >= 5) {
          // Block attempt - no need to log a blocked attempt, but you can if you want
          // We won't log it to avoid spamming the DB during a DDOS
          throw new Error("Too many failed attempts, try again later");
        }

        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin) {
          await prisma.adminLoginLog.create({
            data: { email, ipAddress, success: false }
          });
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) {
          await prisma.adminLoginLog.create({
            data: { email, ipAddress, success: false }
          });
          throw new Error("Invalid email or password");
        }

        await prisma.adminLoginLog.create({
          data: { email, ipAddress, success: true }
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
