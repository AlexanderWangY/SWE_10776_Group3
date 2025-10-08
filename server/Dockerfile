FROM ghcr.io/astral-sh/uv:latest AS dev
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync
COPY . .
EXPOSE 8080
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]

FROM ghcr.io/astral-sh/uv:latest AS prod
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --no-editable
COPY . .
EXPOSE 8080
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "4"]
