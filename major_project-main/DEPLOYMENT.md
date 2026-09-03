# Deployment

The stack is three services: the Express/Socket.IO API (`server/`), the Vite SPA served by nginx
(`client/`), and MongoDB. Candidate code runs in throwaway Docker containers started by the API.

## 1. Configure secrets

Copy the examples and fill them in — never commit the real files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
openssl rand -base64 48   # JWT_SECRET
```

Production start-up refuses to boot unless all of the following hold:

| Variable | Requirement in production |
| --- | --- |
| `JWT_SECRET` | set, unique, ≥ 32 characters |
| `MONGO_URI` | set |
| `CLIENT_URL` or `CORS_ORIGINS` | set, no `*` |
| `DEMO_MODE` | `false` (password-less demo sign-in is off) |
| `CODE_EXECUTION_RUNNER` | `docker` (or `CODE_EXECUTION_ENABLED=false`) |

> The JWT secret that used to live in the committed `server/.env` must be treated as compromised.
> Rotate it before the first deploy; every previously issued token stops working.

Client variables are baked into the bundle at build time, so rebuild the image after changing them.

## 2. Run with Docker Compose

```bash
export JWT_SECRET=...            # openssl rand -base64 48
export CLIENT_URL=https://interview.example.com
docker compose -f major_project-main/docker-compose.yml up -d --build
```

The client is published on `${CLIENT_PORT:-8080}` and proxies `/api` and `/socket.io` to the API,
so both share one origin. Put TLS termination (nginx, Caddy, an ALB) in front of that port and
point `CLIENT_URL` at the public origin.

The API container mounts `/var/run/docker.sock` to start sandbox containers. That is equivalent to
root on the host: run it on a dedicated machine, or replace it with a remote/rootless daemon
(`DOCKER_HOST`) if the host is shared.

Pre-pull the sandbox images on the host so the first submission is not slow:

```bash
docker pull node:18-alpine && docker pull python:3.11-slim && docker pull gcc:13 && docker pull eclipse-temurin:17-jdk
```

## 3. Run without Docker

```bash
cd major_project-main/server && npm ci --omit=dev && NODE_ENV=production node src/server.js
cd major_project-main/client && npm ci && npm run build   # serve dist/ with any static host
```

Set `SERVE_CLIENT=true` to have the API serve `client/dist` itself for a single-process deployment.

## 4. Operations

- Health: `GET /api/health` returns 503 in production when MongoDB is unreachable — use it as the
  load balancer and container health check.
- Logs: JSON lines on stdout in production, each carrying the `X-Request-Id` of the request.
- Rate limits: `AUTH_RATE_LIMIT_MAX`, `API_RATE_LIMIT_MAX`, `CODE_RUN_RATE_LIMIT_MAX` per 15 minutes.
  Keep `TRUST_PROXY=true` behind a proxy so limits key off the real client IP.
- Problem seeding is additive: it inserts missing slugs and never overwrites edited problems.
- Backups: MongoDB holds users, interviews, submissions and payments — snapshot the `mongo-data`
  volume (or use a managed cluster).

## 5. Integrations

| Feature | Variables | Behaviour when unset |
| --- | --- | --- |
| Google sign-in | `GOOGLE_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID` | endpoint returns 503, button reports it is unconfigured |
| AI questions/scoring | `GEMINI_API_KEY` or `OPENAI_API_KEY` | falls back to the static question bank |
| Voice interview | `VAPI_API_KEY`, `VAPI_ASSISTANT_ID`, `VITE_VAPI_PUBLIC_KEY` | voice interview is unavailable |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | checkout returns 503; webhooks rejected without the secret |

Razorpay webhooks must point at `POST /api/payments/webhook`, which is mounted before the JSON body
parser so the raw payload signature can be verified.
