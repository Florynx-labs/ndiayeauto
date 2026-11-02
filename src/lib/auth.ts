import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
export const auth = betterAuth({ appName:"NDIAYE AUTO SERVICE", baseURL:process.env.BETTER_AUTH_URL || "http://localhost:3000", secret:secret || "development-only-secret-change-before-deploy-32chars", database:prismaAdapter(prisma,{provider:"postgresql"}), emailAndPassword:{enabled:true,disableSignUp:true,minPasswordLength:12,maxPasswordLength:128}, plugins:[admin()], trustedOrigins:[process.env.BETTER_AUTH_URL || "http://localhost:3000","https://ndiayeauto.vercel.app"], advanced:{useSecureCookies:process.env.NODE_ENV==="production"} });