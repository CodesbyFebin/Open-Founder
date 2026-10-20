export type AtlasCategory = "legal" | "finance" | "hr" | "product" | "operations" | "growth";
export type ModuleRoute = "/store" | "/checkout" | "/pos" | "/billing" | "/expenses" | "/bookings" | "/staff" | "/crm" | "/card" | "/assistant";
export interface AtlasTask { id: string; category: AtlasCategory; title: string; description: string; route: ModuleRoute; }
export const ATLAS_TASKS: AtlasTask[] = [
  { id: "legal-incorp", category: "legal", title: "Choose entity type (Proprietorship / LLP / Pvt Ltd)", description: "Compare liability, compliance, and cost.", route: "/assistant" },
  { id: "legal-gst", category: "legal", title: "Register for GST (if turnover crosses threshold)", description: "Collect PAN, address proof, bank details.", route: "/billing" },
  { id: "legal-terms", category: "legal", title: "Draft Terms, Privacy & Refund policy", description: "Required for payment and storefront compliance.", route: "/assistant" },
  { id: "fin-bank", category: "finance", title: "Open a current account and UPI VPA", description: "Needed to receive zero-fee UPI.", route: "/checkout" },
  { id: "fin-invoice", category: "finance", title: "Set up GST invoicing", description: "CGST/SGST vs IGST computed automatically.", route: "/billing" },
  { id: "fin-expense", category: "finance", title: "Track expenses and input tax credit", description: "Log every bill with GST paid.", route: "/expenses" },
  { id: "hr-staff", category: "hr", title: "Add staff and roles", description: "Owner, manager, cashier permissions.", route: "/staff" },
  { id: "hr-offer", category: "hr", title: "Draft offer letter", description: "Let the assistant draft it.", route: "/assistant" },
  { id: "prod-catalog", category: "product", title: "Build product catalog", description: "SKU, HSN, GST rate, stock.", route: "/store" },
  { id: "prod-store", category: "product", title: "Launch your online store", description: "Storefront with UPI checkout.", route: "/store" },
  { id: "ops-pos", category: "operations", title: "Set up in-store POS", description: "Cash, card, and dynamic UPI QR.", route: "/pos" },
  { id: "ops-bookings", category: "operations", title: "Enable appointment booking", description: "Services, slots, reminders.", route: "/bookings" },
  { id: "growth-crm", category: "growth", title: "Capture leads in CRM", description: "Pipeline with WhatsApp follow-ups.", route: "/crm" },
  { id: "growth-card", category: "growth", title: "Create a digital business card", description: "Shareable link + QR.", route: "/card" },
  { id: "growth-campaign", category: "growth", title: "Plan a social media campaign", description: "Assistant drafts posts.", route: "/assistant" },
];
