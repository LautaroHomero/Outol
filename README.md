# CanchaYA

Proyecto de practica con `Next.js 16`, `React 19` y `Auth0` para un sistema de reservas de canchas de futbol.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

La app corre en `http://localhost:3000`.

## Auth0

Copia `.env.example` a `.env.local` y completa:

```env
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=http://localhost:3000
```

En tu aplicacion de Auth0 configura:

- `Allowed Callback URLs`: `http://localhost:3000/auth/callback`
- `Allowed Logout URLs`: `http://localhost:3000`

## Estructura

- `app/page.tsx`: landing principal
- `app/dashboard/page.tsx`: panel protegido
- `app/api/canchas/route.ts`: endpoint de ejemplo
- `lib/auth0.ts`: cliente y helpers de Auth0
- `proxy.ts`: integracion de Auth0 en Next 16
