<div align="center">

<img src="https://img.shields.io/badge/TrustGate_AI-Enterprise_Trust_Platform-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white" alt="TrustGate AI"/>

# TrustGate AI
### Universal AI Trust Verification Layer

**The enterprise-grade platform that verifies human authenticity before granting access to high-risk digital interactions.**

[![Azure](https://img.shields.io/badge/Azure-Powered-0078D4?logo=microsoft-azure)](https://azure.microsoft.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Live Demo**](https://trustgate.ai) · [**API Docs**](docs/API.md) · [**Architecture**](docs/ARCHITECTURE.md) · [**Deployment**](docs/DEPLOYMENT.md)

</div>

---

## 🎯 What is TrustGate AI?

TrustGate AI is an **enterprise-grade, multi-modal biometric trust verification platform** that establishes user authenticity before allowing access to high-risk digital interactions. Unlike traditional authentication systems, TrustGate AI combines:

- 🎭 **Face Trust Analysis** — Liveness detection, spoof prevention, blink/head-pose challenges
- 🎙️ **Voice Trust Analysis** — Speaker verification, replay attack detection, AI clone detection  
- 🖱️ **Behavioral Intelligence** — Mouse entropy, keyboard rhythm, VPN/bot detection
- 🧠 **AI Orchestrator** — Adaptive risk-based verification routing (no unnecessary checks)
- 📜 **Digital Trust Passport** — Signed JWT-like credential issued after successful verification
- 💬 **Secure AI Assistant** — Domain-specific GPT-4o chat, gated behind verification
- 📊 **Enterprise Dashboard** — Real-time analytics, risk heatmaps, audit logs
- 📄 **Verification Reports** — PDF reports with trust scores, timelines, and XAI explanations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TrustGate AI Platform                                │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    AI ORCHESTRATOR (Brain)                            │   │
│  │  Adaptive Routing · Risk Escalation · Challenge Engine · Sessions    │   │
│  └─────────────────────────┬────────────────────────────────────────────┘   │
│                            │                                                  │
│         ┌──────────────────┼──────────────────────┐                         │
│         ▼                  ▼                        ▼                         │
│  ┌────────────┐   ┌───────────────┐   ┌─────────────────────┐               │
│  │Face Engine │   │ Voice Engine  │   │ Behavioral Engine   │               │
│  │ MediaPipe  │   │ Whisper+Res.  │   │ Mouse+KB+FP+VPN     │               │
│  └─────┬──────┘   └──────┬────────┘   └──────────┬──────────┘               │
│        └─────────────────┼──────────────────────┘                           │
│                          ▼                                                    │
│              ┌───────────────────────────┐                                   │
│              │   Risk Intelligence (XAI) │                                   │
│              │   Trust Score + Passport  │                                   │
│              └───────────────────────────┘                                   │
└──────────────────────────────────────────────────────────────────────────────┘
                                │
           ┌────────────────────▼──────────────────────┐
           │              Azure Cloud                    │
           │  Static Web Apps  · Container Apps          │
           │  Cosmos DB  ·  Blob Storage  ·  Key Vault   │
           │  Azure OpenAI  ·  Entra ID  ·  Monitor      │
           └────────────────────────────────────────────-┘
```

### Adaptive Verification Flow

| Risk Level | Trigger | Modules |
|-----------|---------|---------|
| **LOW** (Score ≥ 80) | Clean initial context | Face only |
| **MEDIUM** (60–79) | Mild anomalies | Face + Voice |
| **HIGH** (40–59) | Multiple signals | Face + Voice + Behavioral + Challenges |
| **CRITICAL** (< 40) | Fraud indicators | All modules + Human Review Flag |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optional)
- Azure subscription (optional — Demo Mode works without it)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/trustgate-ai.git
cd trustgate-ai

# Copy environment variables
cp .env.example .env

# Start in Demo Mode (no Azure needed)
docker-compose up -d

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env vars
cp .env.example .env
# Edit .env: set DEMO_MODE=true for local dev

# Start the API server
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Copy env vars
cp ../.env.example .env.local
# Edit .env.local: set VITE_DEMO_MODE=true

# Start development server
npm run dev
# Opens at http://localhost:3000
```

---

## 🎛️ Configuration

### Demo Mode (Zero Dependencies)

Set `DEMO_MODE=true` (backend) and `VITE_DEMO_MODE=true` (frontend) to run the complete platform without any Azure services:

| Feature | Demo Mode Behavior |
|---------|-------------------|
| Webcam | Simulated face with blinks/nods |
| Microphone | Pre-recorded audio samples |
| AI Engines | Seeded realistic scores (75–97 range) |
| Trust Passport | HMAC-SHA256 signed (no Key Vault) |
| AI Summary | Pre-crafted templates |
| Dashboard | 30 days of realistic simulated data |
| PDF Reports | Generated from simulated data |
| AI Chat | Domain-specific canned responses |

A yellow `⚠️ DEMO MODE` banner is displayed in all demo sessions.

### Environment Variables

See [`.env.example`](.env.example) for all variables with descriptions.

Key variables:
```env
# Core
DEMO_MODE=false              # true for offline demo
APP_ENV=production           # development | staging | production

# Azure OpenAI (required for production AI summary + chat)
AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Azure Cosmos DB
COSMOS_DB_URL=https://YOUR_ACCOUNT.documents.azure.com:443/
COSMOS_DB_KEY=your-cosmos-key

# Trust Thresholds (customize per deployment)
TRUST_THRESHOLD_LOW=80       # ≥80 = LOW risk
TRUST_THRESHOLD_MEDIUM=60    # ≥60 = MEDIUM risk
TRUST_THRESHOLD_HIGH=40      # ≥40 = HIGH risk
```

---

## 📐 Project Structure

```
TrustGate AI/
├── frontend/                          # React 18 + TypeScript 5 + Vite 5
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # Design system primitives
│   │   │   ├── face/                  # Face analysis components
│   │   │   ├── voice/                 # Voice analysis components
│   │   │   ├── behavioral/            # Behavioral analysis UI
│   │   │   ├── orchestrator/          # Verification flow controller
│   │   │   ├── risk/                  # Risk/trust score display
│   │   │   ├── passport/              # Digital Trust Passport UI
│   │   │   ├── dashboard/             # Enterprise dashboard
│   │   │   ├── chat/                  # Secure AI assistant
│   │   │   └── report/                # PDF report preview
│   │   ├── pages/                     # Route-level page components
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── services/                  # API service layer
│   │   ├── store/                     # Zustand state management
│   │   ├── types/                     # TypeScript interfaces
│   │   ├── config/                    # App configuration
│   │   └── utils/                     # Utilities
│   └── Dockerfile
│
├── backend/                           # FastAPI + Python 3.11
│   ├── app/
│   │   ├── api/v1/routes/             # REST API endpoints
│   │   ├── api/websockets/            # WebSocket endpoints
│   │   ├── core/                      # Config, security, encryption, RBAC
│   │   ├── orchestrator/              # AI Orchestrator + adaptive router
│   │   ├── engines/
│   │   │   ├── face/                  # Face analysis sub-engines
│   │   │   ├── voice/                 # Voice analysis sub-engines
│   │   │   ├── behavioral/            # Behavioral analysis sub-engines
│   │   │   └── challenge/             # Challenge engine
│   │   ├── risk/                      # Risk calculator + XAI explainer
│   │   ├── passport/                  # Trust Passport lifecycle
│   │   ├── services/                  # Azure integrations
│   │   ├── models/                    # Pydantic schemas + DB models
│   │   └── demo/                      # Demo mode implementations
│   ├── tests/                         # pytest unit + integration tests
│   └── Dockerfile
│
├── infrastructure/
│   ├── bicep/                         # Azure IaC templates
│   └── .github/workflows/             # CI/CD pipelines
│
├── docs/                              # Documentation
└── docker-compose.yml                 # Local development
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000/api/v1`

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/verify/start` | Start a verification session |
| `GET` | `/verify/{id}/status` | Get session status |
| `GET` | `/verify/{id}/result` | Get final verification result |
| `POST` | `/verify/{id}/submit/face` | Submit face frame |
| `POST` | `/verify/{id}/submit/voice` | Submit voice clip |
| `POST` | `/verify/{id}/submit/behavioral` | Submit behavioral data |
| `POST` | `/verify/{id}/challenge/complete` | Submit challenge result |
| `GET` | `/passport/{id}` | Get Trust Passport |
| `GET` | `/passport/{id}/validate` | Validate Trust Passport |
| `POST` | `/chat/message` | Send AI assistant message |
| `POST` | `/chat/stream` | Streaming AI response (SSE) |
| `POST` | `/reports/generate` | Generate PDF report |
| `GET` | `/dashboard/stats` | Dashboard statistics |
| `GET` | `/dashboard/recent` | Recent verifications |
| `GET` | `/health` | Health check |

### WebSocket Endpoints

| Endpoint | Description |
|----------|-------------|
| `WS /ws/face/{session_id}` | Real-time face frame streaming |
| `WS /ws/voice/{session_id}` | Real-time voice streaming |

---

## 🧠 AI Engines

### Face Trust Engine

| Component | Technology | What it detects |
|-----------|-----------|----------------|
| Face Detection | MediaPipe FaceDetection | Face presence, count, confidence |
| Face Landmarks | MediaPipe FaceMesh (468 pts) | Full face geometry |
| Blink Detection | EAR (Eye Aspect Ratio) | Natural blinks, PERCLOS |
| Head Pose | OpenCV PnP solver | Pitch/Yaw/Roll, attention |
| Liveness | Texture + motion analysis | Live person vs photo/video |
| Spoof Detection | LBP + FFT + reflection | Print/screen/mask attacks |
| Virtual Camera | Heuristic detection | OBS/XSplit/ManyCam indicators |

### Voice Trust Engine

| Component | Technology | What it detects |
|-----------|-----------|----------------|
| Transcription | OpenAI Whisper | Speech-to-text verification |
| Speaker Verification | Resemblyzer (ECAPA-TDNN) | Identity matching |
| Replay Detection | Spectral analysis | Pre-recorded audio playback |
| Clone Detection | Prosody + formant analysis | TTS/GAN voice synthesis |
| Noise Analysis | SNR + environment | Suspicious acoustic environment |

### Behavioral Intelligence Engine

| Component | What it analyzes |
|-----------|----------------|
| Mouse Analysis | Entropy, velocity profile, straight-line detection |
| Keyboard Analysis | Rhythm consistency, dwell/flight times |
| Fingerprint Analysis | Browser/device fingerprint anomalies |
| VPN Detection | IP/ASN reputation, timezone mismatch |
| Automation Detection | Selenium/Playwright/Puppeteer/headless signals |

---

## 📜 Digital Trust Passport

After successful verification, a signed Trust Passport is issued:

```json
{
  "passport_id": "tg_psp_01J9ZX7K...",
  "session_id": "sess_01J9ZX...",
  "trust": {
    "score": 91.4,
    "level": "LOW",
    "components": {
      "face": 94.2,
      "voice": 88.7,
      "behavioral": 91.3
    }
  },
  "issued_at": "2026-07-29T04:00:00Z",
  "expires_at": "2026-07-29T05:00:00Z",
  "verification_methods": ["face_liveness", "voice_verification"],
  "challenges_passed": ["blink_twice", "phrase_readback"],
  "signature": "ECDSA:SHA256:base64...",
  "public_key_id": "trustgate-signing-key-v1"
}
```

Validate downstream: `GET /api/v1/passport/{passport_id}/validate`

---

## 🔒 Security Model

| Layer | Implementation |
|-------|---------------|
| **Transport** | TLS 1.3 enforced (Azure provides this) |
| **Authentication** | Bearer JWT (Entra ID) + API Key |
| **Authorization** | RBAC (admin/analyst/auditor/user/api_client) |
| **Encryption** | AES-256-GCM at rest, ECDSA P-256 for signing |
| **Secrets** | Azure Key Vault (never in env in production) |
| **Rate Limiting** | 100 req/min/IP, 10 verifications/hour/IP |
| **Audit Logging** | Every API call logged to Cosmos DB |
| **Privacy** | No raw biometrics stored — embeddings/scores only |
| **Consent** | Explicit camera/mic consent captured and logged |
| **Session TTL** | Verification sessions: 1h; Passports: configurable |

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend
pytest tests/unit/ -v --cov=app --cov-report=html

# Backend integration tests
pytest tests/integration/ -v

# Frontend unit tests
cd frontend
npm run test

# Run all tests with coverage
npm run test:coverage
```

See [docs/TESTING.md](docs/TESTING.md) for the full testing strategy.

---

## ☁️ Azure Deployment

### Quick Deploy with Bicep

```bash
# Login to Azure
az login

# Create resource group
az group create --name trustgate-rg --location eastus

# Deploy all infrastructure
az deployment group create \
  --resource-group trustgate-rg \
  --template-file infrastructure/bicep/main.bicep \
  --parameters environment=prod tenantId=YOUR_TENANT_ID adminObjectId=YOUR_OBJ_ID
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the complete deployment guide.

### Required Azure Services

| Service | Purpose |
|---------|---------|
| Azure Static Web Apps | Frontend hosting (CDN included) |
| Azure Container Apps | Backend API with auto-scaling |
| Azure Cosmos DB | NoSQL database (serverless) |
| Azure Blob Storage | PDF reports, audit media |
| Azure Key Vault | Secret management |
| Azure OpenAI | GPT-4o for summaries and chat |
| Azure Monitor + App Insights | Observability |
| Microsoft Entra ID | Authentication |

---

## 🗄️ Database Schema

### Cosmos DB Collections

**`verifications`** — Final verification results
```json
{
  "id": "uuid",
  "session_id": "sess_...",
  "timestamp": "ISO8601",
  "trust_score": 91.4,
  "risk_level": "LOW",
  "face_result": {...},
  "voice_result": {...},
  "behavioral_result": {...},
  "xai_factors": [...],
  "ai_summary": "string",
  "passport_id": "tg_psp_..."
}
```

**`sessions`** — Active verification sessions (TTL: 24h)
```json
{
  "id": "uuid",
  "session_id": "sess_...",
  "status": "COMPLETED",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "context": { "ip": "...", "user_agent": "...", "device_fingerprint": "..." },
  "timeline": [...]
}
```

**`audit_logs`** — Immutable audit trail (TTL: 1 year)
```json
{
  "id": "uuid",
  "session_id": "sess_...",
  "event_type": "FACE_ANALYZED",
  "severity": "INFO",
  "timestamp": "ISO8601",
  "details": {...},
  "user_context": {...}
}
```

**`passports`** — Issued Trust Passports (TTL: 24h max)
```json
{
  "id": "uuid",
  "passport_id": "tg_psp_...",
  "revoked": false,
  "revocation_reason": null,
  ...full passport object
}
```

---

## 🎨 Design System

- **Framework**: Tailwind CSS 3 + Framer Motion
- **Font**: Inter (headings), JetBrains Mono (code/IDs)
- **Primary**: Azure Blue `#0078D4`
- **Success/Trust**: Trust Green `#00B294`
- **Background**: Dark Slate `#0F172A`
- **Panels**: Slate `#1E293B` with glassmorphism
- **Animations**: Smooth spring physics, micro-interactions on every element
- **Dark Mode**: Always on — enterprise security aesthetic

---

## 📋 Roadmap

- [x] Face liveness detection
- [x] Voice authentication
- [x] Behavioral analysis
- [x] AI Orchestrator
- [x] Adaptive verification
- [x] Live challenge engine
- [x] Digital Trust Passport
- [x] AI verification summary
- [x] Audit timeline
- [x] Demo mode
- [x] Enterprise dashboard
- [x] Secure AI assistant
- [x] PDF reports
- [x] Azure deployment
- [ ] Mobile SDK (iOS/Android)
- [ ] Hardware security key integration
- [ ] FIDO2/WebAuthn support
- [ ] Multi-language support (i18n)
- [ ] Custom branding (white-label)
- [ ] Webhook integration
- [ ] SOC 2 Type II certification

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using Azure AI + React + FastAPI

**TrustGate AI** — Trust, verified.

</div>
