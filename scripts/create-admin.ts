import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
const db=new PrismaClient(),email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),password=process.env.ADMIN_PASSWORD,name=process.env.ADMIN_NAME||"Administrateur NDIAYE AUTO";
if(!email||!password||password.length<12)throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) are required.");
const user=await db.user.upsert({where:{email},update:{role:"admin",emailVerified:true,name},create:{id:crypto.randomUUID(),email,name,role:"admin",emailVerified:true}});
const hash=await hashPassword(password);
await db.account.upsert({where:{id:"credential-"+user.id},update:{password:hash},create:{id:"credential-"+user.id,userId:user.id,accountId:user.id,providerId:"credential",password:hash}});
console.info("Admin account provisioned:",email);await db.$disconnect();