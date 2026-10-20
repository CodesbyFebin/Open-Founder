# AI Assistant

`POST /api/v1/assistant {"message": "..."}` returns `{ reply }`.

| Setup | Config |
|---|---|
| Offline (default) | leave `LLM_BASE_URL` blank. Rule-based replies that route tasks to modules |
| Ollama (local, free) | `LLM_BASE_URL=http://ollama:11434/v1`, `LLM_MODEL=llama3.1` |
| OpenAI | `LLM_BASE_URL=https://api.openai.com/v1`, `LLM_API_KEY=sk-…` |
| Groq / OpenRouter / Together / LM Studio | their OpenAI-compatible base URL + key |

The assistant drafts content and suggests which module to open. It does not take irreversible actions, such as sending money or filing returns, on its own.
