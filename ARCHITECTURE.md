# Architecture Specification: TrustGate AI (v1.0)

**TrustGate AI** is the Universal AI Operating System for Trust — a high-stakes digital identity verification platform built for Microsoft Build, Azure AI Foundry Showcase, and enterprise security operations.

---

## 🏛️ System Architecture

```
                                  TRUSTGATE AI ARCHITECTURE
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND (React 19 + Vite)                                 │
│  Landing Page ──► Biometric Gateway ──► Mission Control ──► Trust Center ──► Analytics   │
│         │                  │                  │                  │              │         │
│         ▼                  ▼                  ▼                  ▼              ▼         │
│   Keynote Story     468-Mesh Vision     Azure Health       SOC Inspection  Recharts   │
│   & Sandbox Demo    Voice Spectrogram   CISO Telemetry     Side Drawer     Intelligence│
└─────────────────────────────────────────────────────────┬─────────────────────────────────┘
                                                          │ REST / WebSocket
┌─────────────────────────────────────────────────────────▼─────────────────────────────────┐
│                                BACKEND (FastAPI + Python 3.12)                            │
│                  Biometric Orchestrator ──► XAI Risk Engine ──► Passport Signer           │
└─────────────────────────────────────────────────────────┬─────────────────────────────────┘
                                                          │ Azure SDK
┌─────────────────────────────────────────────────────────▼─────────────────────────────────┐
│                               AZURE AI FOUNDRY INFRASTRUCTURE                              │
│    Azure OpenAI (GPT-4o) • Azure AI Vision (468 Mesh) • Azure AI Speech • Cosmos DB      │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System & Token Philosophy

### 1. Surface Levels
- `surface-0` (`#070D19`): Matte dark base background
- `surface-1` (`#0F172A`): Primary container background
- `surface-2` (`#162032`): Elevated panel surface
- `surface-3` (`#243447`): Elevated dialog / card surface

### 2. Brand Palette
- Primary: Azure Blue (`#0078D4`, gradient to `#106EBE`)
- Secondary: Emerald Trust Green (`#00B294`)
- Accent: Electric Cyan (`#00BCF2`)
- Status: Soft Emerald (`#10B981`), Amber (`#F59E0B`), Crimson (`#EF4444`)

### 3. Typography & Icons
- Typography: `Inter` (sans-serif text) & `JetBrains Mono` (telemetry/code)
- Iconography: Standardized `lucide-react` vector set

---

## 🔑 Trust Passport Lifecycle

1. **Capture**: Client captures 468 facial mesh coordinates, vocal acoustic spectrogram, and mouse/keystroke dynamics.
2. **Analysis**: Azure AI Vision and Azure AI Speech process passive liveness and vocal similarity.
3. **Risk Scoring**: Azure OpenAI XAI Risk Engine synthesizes multi-modal vectors and generates structured reasoning.
4. **Issuance**: Signed Digital Trust Passport (`TP-AZURE-99842`) issued and committed to global Zustand state store.
5. **Propagation**: Session status updates across Mission Control, Trust Center SOC registry, Analytics intelligence, AI Copilot, and Executive PDF Reports.

---

## 🛠️ Repository Directory Structure

```
frontend/
├── src/
│   ├── assets/             # Static graphics
│   ├── components/
│   │   ├── chat/           # SecureAIChat.tsx
│   │   ├── landing/        # MiniDemoSandbox.tsx
│   │   ├── layout/         # AppContainer.tsx
│   │   ├── orchestrator/   # VerificationFlow.tsx
│   │   ├── report/         # ReportPreview.tsx
│   │   └── ui/             # Button, Card, Badge, Modal, Skeleton, EmptyState, CommandPalette
│   ├── config/             # demo.config.ts
│   ├── hooks/              # useWebcam.ts, useAuditTimeline.ts
│   ├── pages/              # LandingPage, OverviewPage, VerificationPage, TrustCenterPage, DashboardPage, ChatPage, ReportPage
│   ├── services/           # faceService, voiceService, riskService
│   ├── store/              # trustStore.ts, verificationStore.ts
│   ├── styles/             # tokens.css, motion.ts
│   └── types/              # trust.ts, passport.ts, audit.ts
```
