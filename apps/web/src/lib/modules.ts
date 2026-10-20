/** Sidebar modules from the pasted dashboard, mapped to real routes in this app. */
export type ModuleCategory = "catCore" | "catFinance" | "catCommerce" | "catGrowth" | "catOperations" | "catCompliance";
export interface ModuleDef { id: string; key: string; icon: string; category: ModuleCategory; href: string }
export const MODULES: ModuleDef[] = [
  { id: "dashboard", key: "dashboard", icon: "📊", category: "catCore", href: "/" },
  { id: "atlas", key: "atlas", icon: "🧭", category: "catCore", href: "/atlas" },
  { id: "ai-assistant", key: "assistant", icon: "🤖", category: "catCore", href: "/assistant" },
  { id: "upi-gateway", key: "checkout", icon: "💳", category: "catFinance", href: "/checkout" },
  { id: "invoicing", key: "billing", icon: "🧾", category: "catFinance", href: "/billing" },
  { id: "accounting", key: "accounting", icon: "📒", category: "catFinance", href: "/billing" },
  { id: "expenses", key: "expenses", icon: "💰", category: "catFinance", href: "/expenses" },
  { id: "store", key: "store", icon: "🛍️", category: "catCommerce", href: "/store" },
  { id: "pos", key: "pos", icon: "🖥️", category: "catCommerce", href: "/pos" },
  { id: "inventory", key: "inventory", icon: "📦", category: "catCommerce", href: "/expenses" },
  { id: "whatsapp", key: "whatsapp", icon: "💬", category: "catGrowth", href: "/crm" },
  { id: "crm", key: "crm", icon: "🎯", category: "catGrowth", href: "/crm" },
  { id: "social", key: "social", icon: "📣", category: "catGrowth", href: "/assistant?q=" + encodeURIComponent("Plan a social media campaign for my business") },
  { id: "staff", key: "staff", icon: "👥", category: "catOperations", href: "/staff" },
  { id: "appointments", key: "bookings", icon: "📅", category: "catOperations", href: "/bookings" },
  { id: "business-card", key: "card", icon: "🪪", category: "catOperations", href: "/card" },
  { id: "gst-returns", key: "gstReturns", icon: "📋", category: "catCompliance", href: "/billing" },
  { id: "legal", key: "legal", icon: "⚖️", category: "catCompliance", href: "/atlas" },
];
export const CATEGORIES: ModuleCategory[] = ["catCore", "catFinance", "catCommerce", "catGrowth", "catOperations", "catCompliance"];
export function activeModule(pathname: string): ModuleDef | undefined {
  return MODULES.find((m) => m.href === pathname) ?? MODULES.find((m) => m.href !== "/" && pathname.startsWith(m.href.split("?")[0]));
}
