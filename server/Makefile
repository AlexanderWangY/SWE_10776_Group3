migrate-up:
	@read -p "Enter migration message: " msg; \
	uv run alembic revision --autogenerate -m "$$msg"
	uv run alembic upgrade head
