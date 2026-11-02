import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:8080";
const extraTrustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
}

const trustedOrigins = [
  baseURL,
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ndiayeauto.vercel.app",
  ...extraTrustedOrigins,
];

export const auth = betterAuth({
  appName: "NDIAYE AUTO SERVICE",
  baseURL,
  secret: secret || "development-only-secret-change-before-deploy-32chars",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  plugins: [admin()],
  trustedOrigins: [...new Set(trustedOrigins)],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
