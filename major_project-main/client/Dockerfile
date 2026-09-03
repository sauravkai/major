# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Baked into the bundle at build time; leave empty to use same-origin /api.
ARG VITE_API_URL=
ARG VITE_SOCKET_URL=
ARG VITE_GOOGLE_CLIENT_ID=
ARG VITE_VAPI_PUBLIC_KEY=
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
