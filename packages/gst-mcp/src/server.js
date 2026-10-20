#!/usr/bin/env node
/** GST MCP server (stdio). Exposes GST computation tools to any MCP client. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { computeGst, isValidGstin, paiseToRupeeString, rupeesToPaise } from "@open-founder/core";
const server = new McpServer({ name: "open-founder-gst", version: "0.1.0" });
server.tool("compute_gst_invoice", "Compute CGST/SGST or IGST for invoice lines (amounts in rupees as strings).", {
    supplierStateCode: z.string().regex(/^\d{2}$/), placeOfSupplyStateCode: z.string().regex(/^\d{2}$/),
    lines: z.array(z.object({ description: z.string(), hsnSac: z.string().optional(), quantity: z.number().int().positive(), unitPriceRupees: z.string(), gstRatePercent: z.number() })),
}, async (a) => {
    const r = computeGst(a.lines.map((l) => ({ description: l.description, hsnSac: l.hsnSac, quantity: l.quantity, unitPricePaise: rupeesToPaise(l.unitPriceRupees), gstRateBp: Math.round(l.gstRatePercent * 100) })), a.supplierStateCode, a.placeOfSupplyStateCode);
    const f = paiseToRupeeString;
    return { content: [{ type: "text", text: JSON.stringify({ interState: r.interState, taxable: f(r.taxablePaise), cgst: f(r.cgstPaise), sgst: f(r.sgstPaise), igst: f(r.igstPaise), total: f(r.totalPaise) }, null, 2) }] };
});
server.tool("validate_gstin", "Validate GSTIN format.", { gstin: z.string() }, async ({ gstin }) => ({ content: [{ type: "text", text: JSON.stringify({ gstin, validFormat: isValidGstin(gstin) }) }] }));
await server.connect(new StdioServerTransport());
