# Run a new Alembic migration (autogenerate)
migrate-new:
	docker compose run --rm server uv run alembic revision --autogenerate -m "$(msg)"

# Apply all migrations (upgrade to head)
migrate-up:
	docker compose run --rm server uv run alembic upgrade head

# Roll back the last migration
migrate-down:
	docker compose run --rm server uv run alembic downgrade -1
