import "./globals.css";
import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
export const metadata: Metadata = { title: "Open Founder", description: "Open-source business OS for founders: store, UPI checkout, POS, GST billing, CRM, AI assistant.", manifest: "/manifest.webmanifest" };
export const viewport: Viewport = { themeColor: "#10b981" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><AppShell>{children}</AppShell></body></html>; }
