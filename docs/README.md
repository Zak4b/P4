# P4

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/Fastify-5-202020?style=flat-square&logo=fastify&logoColor=white)](https://fastify.io)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)

Puissance 4 en temps réel

## Architecture

```
P4/
├── apps/
│   ├── web/           # Application Next.js (React)
│   └── api/           # API Fastify + WebSocket
└── docs/              # Documentation
```

### Web

- **Framework** : Next.js 16 (App Router)
- **UI** : React, Material UI

### API

- **Framework** : Fastify
- **Base de données** : MySQL + Prisma ORM
- **Auth** : JWT, cookies, OAuth2 (Google)

## Prérequis

- Docker et Docker Compose
- Réseaux `traefik-net` et `db-net` (MySQL externe)

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Zak4b/P4.git
cd P4

# 2. Configurer les variables d'environnement
cp env.example .env
# Éditer .env avec vos valeurs (DATABASE_URL, JWT_SECRET, etc.)

# 3. Lancer les services
./deploy.sh

# 4. Initialiser la base de données
docker compose exec api npx prisma db push
```

**Services** :

- `api` — API + WebSocket (port 3000)
- `web` — Next.js (port 3001)
