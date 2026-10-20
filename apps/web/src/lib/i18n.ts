export const LOCALES = ["en", "hi", "ml", "ta"] as const; export type Locale = (typeof LOCALES)[number];
type Dict = Record<string, string>;
export const dict: Record<Locale, Dict> = {
  en: { atlas: "Founder Atlas", store: "Store", checkout: "UPI Checkout", pos: "POS", billing: "GST Billing", expenses: "Expenses & Inventory", bookings: "Bookings", staff: "Staff", crm: "CRM", card: "Business Card", assistant: "AI Assistant", offline: "Offline — changes saved locally", add: "Add", total: "Total" },
  hi: { atlas: "फाउंडर एटलस", store: "स्टोर", checkout: "UPI भुगतान", pos: "पीओएस", billing: "जीएसटी बिलिंग", expenses: "खर्च और इन्वेंटरी", bookings: "बुकिंग", staff: "कर्मचारी", crm: "सीआरएम", card: "बिज़नेस कार्ड", assistant: "एआई सहायक", offline: "ऑफ़लाइन — बदलाव स्थानीय रूप से सहेजे गए", add: "जोड़ें", total: "कुल" },
  ml: { atlas: "ഫൗണ്ടർ അറ്റ്ലസ്", store: "സ്റ്റോർ", checkout: "UPI പേയ്മെന്റ്", pos: "പിഒഎസ്", billing: "ജിഎസ്ടി ബില്ലിംഗ്", expenses: "ചെലവും സ്റ്റോക്കും", bookings: "ബുക്കിംഗ്", staff: "ജീവനക്കാർ", crm: "സിആർഎം", card: "ബിസിനസ് കാർഡ്", assistant: "എഐ സഹായി", offline: "ഓഫ്‌ലൈൻ — മാറ്റങ്ങൾ ലോക്കലായി സേവ് ചെയ്തു", add: "ചേർക്കുക", total: "ആകെ" },
  ta: { atlas: "நிறுவனர் அட்லஸ்", store: "கடை", checkout: "UPI கட்டணம்", pos: "பிஓஎஸ்", billing: "ஜிஎஸ்டி பில்லிங்", expenses: "செலவு & சரக்கு", bookings: "முன்பதிவு", staff: "பணியாளர்கள்", crm: "சிஆர்எம்", card: "வணிக அட்டை", assistant: "AI உதவியாளர்", offline: "ஆஃப்லைன் — மாற்றங்கள் உள்ளூரில் சேமிக்கப்பட்டன", add: "சேர்", total: "மொத்தம்" },
};
export function t(locale: Locale, key: string) { return dict[locale][key] ?? dict.en[key] ?? key; }
