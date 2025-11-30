# 🚀 URL Shortener

Production-ready URL shortener with Redis caching, rate limiting, custom aliases and link expiry.

## ✨ Features

| Feature         | Status              | Metrics          |
|----------------|---------------------|------------------|
| Basic URLs     | POST /api/shorten   | Base62 encoding  |
| Custom Codes   | `customCode` field  | Collision checks |
| TTL Expiration | `ttlHours` field    | Auto-cleanup     |
| Rate Limiting  | Redis 100/min/IP    | Abuse protection |
| Redis Caching  | Cache-aside pattern | <50ms p99        |
| Redirects      | GET /:code          | 301 redirects    |

## Quickstart

