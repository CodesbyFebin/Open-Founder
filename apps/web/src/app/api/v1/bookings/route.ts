import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { messagingAdapterFromEnv, templates } from "@open-founder/messaging-adapters";
import { authenticate, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
const Schema = z.object({ customerName: z.string().min(1).max(100), customerMobile: z.string().regex(/^(\+91)?[6-9]\d{9}$/), service: z.string().min(1).max(100), startsAt: z.string().datetime() });
export async function POST(req: NextRequest) { const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  const booking = await prisma.booking.create({ data: { ...b, startsAt: new Date(b.startsAt), businessId: a.businessId } });
  await messagingAdapterFromEnv().send({ to: b.customerMobile, text: templates.bookingReminder(new Date(b.startsAt).toLocaleString("en-IN")) }).catch(() => undefined);
  return json({ booking }, 201); }
