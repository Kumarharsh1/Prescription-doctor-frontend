# Prescription-doctor-frontend

https://prescription-ai-frontend.onrender.com/

# AI Prescription Intelligence - Frontend

React + Vite + Tailwind CSS frontend for the prescription analysis app.
Upload a prescription photo and the AI (backend) extracts medicines,
dosages, frequency and instructions.

## Repo structure (deploy-ready)

Everything lives at the repo ROOT so it deploys cleanly to Render as a
static site.

```
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js
src/
  main.jsx
  App.jsx
  index.css
  components/
    UploadCard.jsx
    ResultPanel.jsx
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes (prod) | URL of the deployed backend, e.g. `https://prescription-doctor-backend.onrender.com`. In local dev it falls back to `/api` (proxied to `:8000`). |

## Local development

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` to
the backend at `http://localhost:8000`.

## Production build

```bash
npm install
npm run build   # outputs to dist/
```

## Deploying to Render

1. Push this repo to GitHub.
2. In Render, create a **New Static Site** and connect the repo.
3. Set `Build Command`: `npm install && npm run build`
4. Set `Publish Directory`: `dist`
5. Add `VITE_API_URL` env var pointing to your deployed backend.
6. Deploy. The static site will call the backend API directly from the
   browser (CORS is already enabled on the backend).
