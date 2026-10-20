# Security

- API keys are stored hashed. Requests are rate-limited per key.
- Payment webhooks are checked with HMAC-SHA256 using a constant-time compare. Each UTR can be used only once, which blocks replays.
- Money is handled as integer paise, which avoids rounding exploits.
- Secrets live only in `.env`, which is git-ignored.
- **Known gaps:** there's no login UI or user roles yet (API key only), no 2FA, and no third-party security audit has been done. Claims of "100% fraud protection" are not made.

## Hardening
HTTPS only, a firewall in front of Postgres, regular backups, and rotate keys if they leak.

## Reporting
Please report vulnerabilities privately through GitHub Security Advisories on the repo. Don't open a public issue for them.
