# Self-hosting with Docker

```bash
git clone https://github.com/CodesbyFebin/Open-Founder && cd Open-Founder
cp .env.example .env   # change POSTGRES_PASSWORD and DATABASE_URL to match
docker compose up -d --build
docker compose exec web npm run db:push
docker compose exec web npm run db:seed
```
The app runs at `http://<host>:3000`.

## Production checklist
- Put it behind HTTPS (Caddy, Nginx or Traefik). The UPI webhook and the PWA need HTTPS.
- Set strong `POSTGRES_PASSWORD`, `BOOTSTRAP_API_KEY` and `PAYMENT_WEBHOOK_SECRET`.
- Don't expose Postgres port 5432 publicly.
- Back up: `docker compose exec db pg_dump -U founder open_founder > backup.sql`
- Update: `git pull && docker compose up -d --build`

## Optional services
- **WAHA** (self-hosted WhatsApp): see [[WhatsApp Setup]]
- **Ollama** (local AI): set `LLM_BASE_URL=http://ollama:11434/v1`; see [[AI Assistant]]
