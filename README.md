# 🚀 URL Shortener

Production‑ready URL shortener with Redis caching, rate limiting, custom aliases, and a real‑time analytics dashboard.

![Landing](assets/hero-dashboard.png)
![Analytics](assets/analytics-dashboard.png)

---

## 🎯 Live URLs

- **Frontend:** https://url-shortener-phi-peach.vercel.app  
- **Backend API:** https://url-shortener-production-9379.up.railway.app  

Backend health check returns a JSON status at:

GET / # root
GET /health # health endpoint


---

## ✨ Features

- 🔗 Short URLs with Base62 codes or user‑defined custom codes.
- ⏱ Per‑link TTL (`ttlHours`) with automatic expiry.
- 🛡 Rate limiting per IP plus Redis cache‑aside for redirects.
- 📊 Analytics per short code:
  - Clicks over time (last 7 days).
  - Device types (desktop / mobile + OS).
  - Countries.
  - Referrers (source pages like Google, Twitter, etc.).
  - Browsers (Chrome, Safari, WebKit, etc.).
- 🧊 Glassmorphism UI with animations (React + Tailwind + Framer Motion).
- 🧪 Jest tests and load‑test scripts.
- 🐳 Dockerized backend with Postgres + Redis (good fit for Railway).

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Redis, Docker.
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Infra:**  
  - Railway – Postgres + Redis + Node backend.  
  - Vercel – React frontend.
- **Testing:** Jest, Supertest, custom load scripts.

---


```md
Only paste this part, nothing else, and remove any extra backticks you added before/after it:

```md
## 🧬 Architecture

```
Client (React)
│
├── POST /api/shorten            # create short URL
├── GET  /api/stats/:code        # analytics
├── GET  /api/stats/:code/browsers
├── GET  /api/qr/:code           # QR image data URL
└── GET  /:code                  # redirect with analytics

Backend (Express)
│
├── PostgreSQL  (urls, clicks tables)
└── Redis       (url cache, click de‑dup keys)
```
```
- `urls`  
  - `original_url`, `short_code`, `clicks`, `expires_at`, timestamps.
- `clicks`  
  - `short_code`, `clicked_at`, `ip_address`, `country`, `city`,  
    `device_type`, `os_name`, `device_model`, `device_vendor`,  
    `browser`, `user_agent`, `referer`.

Redirect flow:

1. `GET /:shortCode` hits `analyticsMiddleware`.
2. Middleware parses IP + User‑Agent, does geo lookup, de‑dups via Redis, and inserts a `clicks` row.
3. Controller resolves original URL via Redis → Postgres and returns a `301` redirect.

---

## 📡 API Reference

Base URL (backend):

https://url-shortener-production-9379.up.railway.app


### Create short URL

POST /api/shorten
Content-Type: application/json


**Body**

{
"url": "https://example.com/my-long-page",
"customCode": "demo123",
"ttlHours": 24
}


**Response**

{
"success": true,
"data": {
"short_code": "3H",
"short_url": "https://url-shortener-production-9379.up.railway.app/3H",
"original_url": "https://example.com/my-long-page",
"expires_at": "2025-12-31T18:30:00.000Z",
"created_at": "2025-12-14T18:30:00.000Z"
}
}


### Redirect

GET /:shortCode


- Responds with `301` redirect to `original_url`.
- Caching is disabled (`Cache-Control: no-store`) so every click passes through the backend and gets logged.

### Analytics (main)

GET /api/stats/:shortCode

**Example response**

{
"short_code": "3H",
"total_clicks": 21,
"unique_ips": 2,
"clicks_by_date": [
{ "date": "2025-12-13", "clicks": 0 },
{ "date": "2025-12-14", "clicks": 7 }
],
"device_breakdown": [
{ "device_type": "desktop macOS", "count": 10 },
{ "device_type": "mobile Android", "count": 5 }
],
"top_countries": [
{ "country": "India", "count": 18 },
{ "country": "United States", "count": 3 }
],
"top_referrers": [
{ "referrer": "https://www.google.com/", "count": 1 }
]
}


### Analytics (browsers)

Used by the “Browsers” card in the dashboard.

GET /api/stats/:shortCode/browsers


**Response**

{
"data": [
{ "browser": "Chrome", "count": 12 },
{ "browser": "Safari / WebKit", "count": 7 }
]
}


### QR Code

GET /api/qr/:shortCode

**Response**

{
"success": true,
"short_code": "3H",
"qr_data_url": "data:image/png;base64,...."
}


You can drop the `qr_data_url` into an `<img>` tag to render the QR.

---

## 🧑‍💻 Local Development

### 1. Clone and install


git clone https://github.com/<your-user>/url-shortener.git
cd url-shortener

backend
npm install

frontend
cd url-shortener-frontend
npm install



### 2. Environment variables (backend)

Create `.env` in the backend root (you already have `.env.example`):


PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/url_shortener

Redis
REDIS_HOST=localhost
REDIS_PORT=6379

App
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
SKIP_HTTPS_REDIRECT=true

Security
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=32-characters-long-encryption-key!!!


Set these to your local Postgres/Redis details.

### 3. Run services with Docker (optional but easiest)


docker-compose up -d # starts Postgres + Redis from docker-compose.yml


Run backend:

npm run dev


Backend will listen on `http://localhost:3000`.

### 4. Frontend env + dev

In `url-shortener-frontend/.env`:

VITE_API_URL=http://localhost:3000


Then:

npm run dev


Visit `http://localhost:5173` (or whatever Vite prints).

---

## ☁️ Deployment Notes

- **Backend on Railway**
  - Service URL: `https://url-shortener-production-9379.up.railway.app`
  - Set `DATABASE_URL` to Railway Postgres, `REDIS_HOST/REDIS_PORT` (or `REDIS_URL`) to Railway Redis.
  - `BASE_URL` is set to the Railway backend URL so `short_url` fields are correct.

- **Frontend on Vercel**
  - Project: `url-shortener-phi-peach`.
  - Env: `VITE_API_URL=https://url-shortener-production-9379.up.railway.app`.

---

## 🧪 Testing & Load

- **Unit / integration tests**

npm test


- **Load tests**

Scripts like `load-test.sh`, `load-script.lua`, and `LOAD_TEST_RESULTS.md` show how the service behaves under load.

---

## 🔮 Roadmap / Ideas

- Auth & per‑user dashboards.
- API keys with rate‑limited programmatic access.
- Export analytics as CSV or JSON.
- Team / workspace support.

---

## 📸 Screenshots

-![Landing](assets/hero-dashboard.png) – landing page with gradient hero + form.
- ![Analytics](assets/analytics-dashboard.png) – analytics page showing clicks, devices, countries, referrers, browsers.

