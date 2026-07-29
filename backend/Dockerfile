# ─────────────────────────────────────────────────────────────────────────────
# TrustGate AI Backend — Multi-Stage Dockerfile
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Base image with system dependencies ──────────────────────────────
FROM python:3.11-slim AS base

# Install system dependencies required for OpenCV, MediaPipe, audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libffi-dev \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Python environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# ── Stage 2: Dependencies ──────────────────────────────────────────────────────
FROM base AS dependencies

COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ── Stage 3: Development ───────────────────────────────────────────────────────
FROM dependencies AS development

# Install development dependencies
RUN pip install watchfiles pytest pytest-asyncio httpx

COPY . .

# Create non-root user for security
RUN groupadd -r trustgate && useradd -r -g trustgate trustgate && \
    chown -R trustgate:trustgate /app

USER trustgate

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ── Stage 4: Production ────────────────────────────────────────────────────────
FROM dependencies AS production

COPY . .

# Pre-download MediaPipe models to bake into image layer
RUN python -c "import mediapipe as mp; mp.solutions.face_detection.FaceDetection(); mp.solutions.face_mesh.FaceMesh(); print('MediaPipe models downloaded')" || true

# Create non-root user
RUN groupadd -r trustgate && useradd -r -g trustgate trustgate && \
    chown -R trustgate:trustgate /app

USER trustgate

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--proxy-headers", "--forwarded-allow-ips", "*"]
