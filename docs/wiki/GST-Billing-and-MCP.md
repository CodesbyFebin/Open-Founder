# GST Billing & MCP

## Rules implemented
- All amounts are integer paise and rates are in basis points (1800 = 18%). No floating-point maths.
- Place of supply equal to `BUSINESS_STATE_CODE` → **CGST + SGST** (half each). Different state → **IGST**.
- GSTIN format validation.
- Expense GST is recorded for Input Tax Credit.

```bash
curl -X POST localhost:3000/api/v1/invoices/preview -H "Authorization: Bearer $KEY" \
 -H 'content-type: application/json' \
 -d '{"placeOfSupplyStateCode":"29","lines":[{"description":"Earbuds","quantity":1,"unitPricePaise":"129900","gstRateBp":1800}]}'
```

## GST MCP server
Lets AI agents (Claude Desktop, Cursor and others) compute GST.
```bash
npm run build:packages && npm run mcp:gst
```
MCP client config:
```json
{ "mcpServers": { "open-founder-gst": { "command": "node", "args": ["/path/Open-Founder/packages/gst-mcp/dist/server.js"] } } }
```
Tools: `compute_gst_invoice`, `validate_gstin`.

## Not yet
- Official GSTN GSTR-1 / GSTR-3B JSON schema
- e-Invoice IRN through the IRP, and e-way bills
- Filing returns directly. Export and file through the GST portal or a GSP.

Have a CA review your filings.
