import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "../config/prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const auth = betterAuth({
  appName: "Prisma Blog App",

  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/v1/auth",

  trustedOrigins: ["http://localhost:3000"],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  advanced: {
    cookiePrefix: "Prisma_Blog_App",
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, req) => {
      try {
        await transporter.sendMail({
          from: `"Prisma Blog App" <${process.env.EMAIL_USER}>`,
          to: `${user.email}`,
          subject: "Verify your email for Prisma Blog App",
          text: `Please verify your email by clicking the following link: ${url}`,
          html: `<p>Please verify your email by clicking the following link:</p><a href="${url}">${url}</a>`,
        });
      } catch (error) {
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
