# WhatsApp Setup

Set `MESSAGING_PROVIDER` to one of:

## `console` (default)
Prints messages to the server logs. Use it for development.

## `waha`: self-hosted
1. Add WAHA to compose or run `docker run -p 3001:3000 devlikeapro/waha`.
2. Open the WAHA dashboard and scan the QR with WhatsApp on your phone.
3. Set `WAHA_BASE_URL` and `WAHA_API_KEY`.

⚠️ WAHA drives WhatsApp Web, which is unofficial. Your number can be banned for bulk or spam use, so keep it to transactional messages.

## `whatsapp-cloud`: official Meta API
1. Create a Meta developer app and add WhatsApp.
2. Copy a permanent access token and the phone number id.
3. Set `WHATSAPP_CLOUD_TOKEN` and `WHATSAPP_CLOUD_PHONE_ID`.

Business-initiated messages outside the 24-hour window need approved templates, and Meta charges per conversation.

## Used for
Order confirmations, pre-checkout OTP for COD, booking reminders and receipts.
