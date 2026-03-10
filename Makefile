-include .env
export

# Le Makefile cible le dev. La prod utilise : ./deploy.sh (docker-compose.yml)
COMPOSE = docker compose -f docker-compose.dev.yml

.PHONY: all help up down restart rebuild \
        restart-backend restart-frontend restart-ai \
        logs logs-backend logs-frontend logs-ai \
        build build-backend build-frontend build-ai \
        ps prune prune-all clean-volumes \
        db-push db-studio db-mysql db-init check-env

# ─── Default ───────────────────────────────────────────────────────────────────
# `make` sans argument → build les images puis démarre les containers

all: build up ## Build les images et démarre les containers dev

# ─── Help ──────────────────────────────────────────────────────────────────────

help: ## Affiche les commandes disponibles
	@grep -Eh '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ─── Env ───────────────────────────────────────────────────────────────────────

check-env: ## Crée .env depuis env.example si absent
	@if [ ! -f .env ]; then \
		echo "Creating .env from env.example..."; \
		cp env.example .env; \
	fi

# ─── Services ──────────────────────────────────────────────────────────────────

up: check-env ## Démarre tous les containers dev (detached)
	$(COMPOSE) up -d

down: ## Arrête et supprime les containers
	$(COMPOSE) down

restart: down up ## Redémarre tous les containers

rebuild: ## Rebuild les images et redémarre
	$(COMPOSE) up -d --build

# ─── Containers individuels ────────────────────────────────────────────────────

restart-backend: ## Redémarre le container backend
	$(COMPOSE) restart backend

restart-frontend: ## Redémarre le container frontend
	$(COMPOSE) restart frontend

restart-ai: ## Redémarre le container AI service
	$(COMPOSE) restart ai-service

# ─── Build ─────────────────────────────────────────────────────────────────────

build: ## Build toutes les images
	$(COMPOSE) build

build-backend: ## Build l'image backend
	$(COMPOSE) build backend

build-frontend: ## Build l'image frontend
	$(COMPOSE) build frontend

build-ai: ## Build l'image AI service
	$(COMPOSE) build ai-service

# ─── Logs ──────────────────────────────────────────────────────────────────────

logs: ## Suit les logs de tous les services
	$(COMPOSE) logs -f

logs-backend: ## Suit les logs du backend
	$(COMPOSE) logs -f backend

logs-frontend: ## Suit les logs du frontend
	$(COMPOSE) logs -f frontend

logs-ai: ## Suit les logs du AI service
	$(COMPOSE) logs -f ai-service

# ─── Status ────────────────────────────────────────────────────────────────────

ps: ## Affiche le statut des containers
	$(COMPOSE) ps

# ─── Base de données ───────────────────────────────────────────────────────────

db-init: ## Initialise le schéma Prisma (premier lancement)
	$(COMPOSE) exec backend npx prisma db push

db-push: ## Pousse le schéma Prisma vers la base
	$(COMPOSE) exec backend npx prisma db push

db-studio: ## Ouvre Prisma Studio (GUI web)
	$(COMPOSE) exec backend npx prisma studio

db-mysql: ## Ouvre un shell MySQL dans le container db
	$(COMPOSE) exec db mysql -u $(MYSQL_USER) -p$(MYSQL_PASSWORD) $(MYSQL_DATABASE)

# ─── Nettoyage ─────────────────────────────────────────────────────────────────

prune: ## Supprime containers arrêtés, réseaux et images dangling
	docker system prune -f

prune-all: ## Nettoyage Docker complet (images + volumes)
	docker system prune -af --volumes

clean-volumes: ## Arrête les containers et supprime les volumes
	$(COMPOSE) down -v
