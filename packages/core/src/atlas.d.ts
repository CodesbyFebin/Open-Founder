export type AtlasCategory = "legal" | "finance" | "hr" | "product" | "operations" | "growth";
export type ModuleRoute = "/store" | "/checkout" | "/pos" | "/billing" | "/expenses" | "/bookings" | "/staff" | "/crm" | "/card" | "/assistant";
export interface AtlasTask {
    id: string;
    category: AtlasCategory;
    title: string;
    description: string;
    route: ModuleRoute;
}
export declare const ATLAS_TASKS: AtlasTask[];
