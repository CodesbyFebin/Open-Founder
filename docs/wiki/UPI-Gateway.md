# UPI Gateway & Verification

The **direct-upi** adapter charges zero fees: customers pay your own UPI ID (VPA) through a dynamic `upi://pay` QR code.

## Flow
1. `POST /api/v1/checkout` creates an order and a session. The amount is kept in integer **paise**.
2. **Paise-offset attribution:** when several open sessions share the same amount, each gets a unique +₹0.01–0.99 offset, so a bank credit matches exactly one order.
3. The customer scans the QR and pays in any UPI app.
4. Verification arrives as a **signed webhook** at `POST /api/v1/webhooks/payment`. It carries an HMAC-SHA256 of the raw body with `PAYMENT_WEBHOOK_SECRET` in the `x-of-signature` header. The sender can be an SMS-forwarder app, a script or your bank-alert relay.
5. **UTR replay shield:** each UTR (bank reference) can settle only one order.
6. Poll `GET /api/v1/checkout/{ref}` for `PENDING → PAID`.

```bash
BODY='{"sessionRef":"…","amountPaise":"49901","utr":"412345678901"}'
SIG=$(printf %s "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" -hex | cut -d" " -f2)
curl -X POST http://localhost:3000/api/v1/webhooks/payment -H "x-of-signature: $SIG" -d "$BODY"
```

## IMAP bank-email watcher: 🚧 stub
The alert-email parser exists, but there's no live IMAP IDLE connection yet. For now, forward alerts to the webhook.

## Other providers
`razorpay`, `cashfree` and `phonepe` are interface stubs. To finish one, implement `createPayment` and `verifyWebhook` in `packages/payment-adapters` using the provider's official SDK.

> ⚠️ Direct UPI to a personal VPA may break your bank's terms for business use. Use a merchant/business VPA.
