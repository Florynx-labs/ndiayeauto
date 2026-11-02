import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
export const Route=createFileRoute("/api/newsletter")({server:{handlers:{POST:async({request})=>{const p=z.object({email:z.string().email().max(254)}).safeParse(await request.json().catch(()=>null));if(!p.success)return Response.json({error:"Adresse e-mail invalide."},{status:400});await prisma.newsletterSubscriber.upsert({where:{email:p.data.email.toLowerCase()},update:{},create:{email:p.data.email.toLowerCase()}});return Response.json({success:true});}}}});