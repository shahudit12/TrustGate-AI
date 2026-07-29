# Demo Specification: TrustGate AI (v1.0)

**TrustGate AI** Keynote Presentation & Technical Walkthrough Guide.

---

## ⏱️ 90-Second Keynote Script

### 0:00 – 0:15 | Landing Page (`/`)
- **Visual**: Open on Landing Page hero. Highlight headline *"The Enterprise Trust Platform for the AI Era"*.
- **Speech**: *"Generative AI has broken traditional authentication. Passwords, SMS codes, and legacy MFA can no longer distinguish real humans from synthetic deepfakes. TrustGate AI is the universal AI Operating System for Trust."*
- **Action**: Click *"Execute Live Verification"* in the inline Keynote Sandbox to demonstrate zero-navigation real-time scanning.

### 0:15 – 0:40 | Biometric Identity Gateway (`/verify`)
- **Visual**: Navigate to Verification Gateway.
- **Speech**: *"Our airport-grade biometric gateway processes 468 facial landmark coordinates in real-time while matching neural vocal acoustic spectrograms. Observe how confidence builds progressively—from liveness detection to vector synthesis."*
- **Action**: Advance through stepper to issue Trust Passport `TP-AZURE-99842`.

### 0:40 – 0:60 | Mission Control (`/overview`)
- **Visual**: Navigate to Mission Control. Point out live Azure AI microservice health cards.
- **Speech**: *"Notice how the newly issued passport instantly updates our executive Mission Control. CISOs get complete visibility into overall platform posture, threat levels, and live Azure OpenAI latency."*

### 0:60 – 0:75 | Trust Center SOC Command (`/trust-center`)
- **Visual**: Click Passport `TP-AZURE-99842` in the Registry.
- **Speech**: *"For security analysts, the Trust Center opens an Azure Portal-style inspection drawer displaying the full vertical audit timeline and cryptographic evidence."*

### 0:75 – 0:85 | ChatGPT Enterprise AI Copilot (`/chat`)
- **Visual**: Open AI Copilot. Click prompt chip *"Inspect recent high-risk corporate wire transfers"*.
- **Speech**: *"When operators query sensitive data, AI Copilot inspects the active Trust Passport before responding, providing complete explainability."*

### 0:85 – 0:90 | Executive Report (`/report/:sessionId`)
- **Visual**: Open Executive Report.
- **Speech**: *"Finally, compliance officers can export a sealed, printable PDF with QR verification and cryptographic hash signatures. That is TrustGate AI."*

---

## 🛠️ 5-Minute Technical Deep Dive

1. **Problem**: Why multi-modal biometrics (face + voice + behavior) are required to combat generative AI synthetic fraud.
2. **Architecture**: React 19 + Vite frontend communicating with FastAPI backend risk orchestration engine.
3. **Azure Services**:
   - **Azure AI Vision**: 468-point 3D landmark mesh mapping.
   - **Azure AI Speech**: Acoustic spectrogram speaker verification.
   - **Azure OpenAI (GPT-4o)**: Explainable AI (XAI) risk reasoning generation.
   - **Cosmos DB**: Multi-region global passport token synchronization.
4. **Explainability**: Structured XAI reasoning detailing evidence used, risk factors, and mitigations.
5. **Security & Cryptography**: Signed session tokens, QR code verification endpoints, and immutable audit logs.

---

## 🎮 Demo Mode & Recovery Instructions

- **Mode Switcher**: Located in top-right navbar (`LIVE` / `DEMO` / `SIMULATION`).
- **Offline / Backup**: In `DEMO` or `SIMULATION` mode, all pipeline steps execute deterministically using local state without external API dependencies.
