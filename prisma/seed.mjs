// Creates a Business and prints its id. Usage: node prisma/seed.mjs "My Shop"
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const b = await p.business.create({ data: { name: process.argv[2] ?? "My Business" } });
console.log(`BOOTSTRAP_BUSINESS_ID=${b.id}`); await p.$disconnect();
