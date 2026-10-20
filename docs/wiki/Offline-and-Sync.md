# Offline & Sync

- The web app queues writes such as POS sales and expenses in **IndexedDB** while offline, and shows an offline banner.
- When it's back online, the queue is sent to `POST /api/v1/sync` with your API key.
- Sync is append-only. There's no conflict resolution for concurrent edits of the same record yet.
- The desktop and Android shells need the server reachable to load the app the first time. Full offline-first packaging is planned.

Languages: EN, HI, ML and TA, switchable in the header. Contributions to translations are welcome.
