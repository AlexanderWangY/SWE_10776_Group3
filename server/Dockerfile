# =========================
# DEVELOPMENT STAGE
# =========================
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS dev

# Set working directory to /app
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies (including dev)
RUN uv sync --locked

# Copy the rest of the source code
COPY . .

# Run FastAPI with hot reload
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]


# =========================
# PRODUCTION STAGE
# =========================
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS prod

WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies without dev packages
RUN uv sync --locked --no-dev

# Copy source code
COPY . .

# Run FastAPI with multiple workers
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "4"]
