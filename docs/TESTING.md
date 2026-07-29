# TrustGate AI — Testing Strategy

## Overview

TrustGate AI uses a layered testing strategy covering unit tests, integration tests, end-to-end tests, and manual verification checklists.

```
Testing Pyramid
═══════════════
      /\          E2E Tests (Playwright)
     /  \         — Full user journey verification
    /────\        Integration Tests (pytest + httpx)
   /      \       — API endpoint testing with demo mode
  /────────\      Unit Tests (pytest + vitest)
 /          \     — Engine logic, risk calculation, passport
/────────────\    
```

---

## Backend Tests (pytest)

### Setup

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx pytest-cov pytest-mock

# Run all tests
pytest -v

# Run with coverage
pytest --cov=app --cov-report=html --cov-report=term-missing

# Run specific module
pytest tests/unit/test_risk_engine.py -v
```

### Unit Tests

#### `tests/unit/test_risk_engine.py`

| Test | Description | Expected Outcome |
|------|-------------|-----------------|
| `test_low_risk_score_calculation` | All engines return high confidence | Score ≥ 80, RiskLevel.LOW |
| `test_medium_risk_score_calculation` | Face good, voice borderline | Score 60–79, RiskLevel.MEDIUM |
| `test_high_risk_score_calculation` | Multiple anomalies | Score 40–59, RiskLevel.HIGH |
| `test_critical_risk_escalation` | Spoof detected | Score < 40, RiskLevel.CRITICAL |
| `test_xai_factors_generated` | Any result | XAI factors list not empty, has descriptions |
| `test_face_spoof_causes_critical` | Spoof detected in face | Immediate CRITICAL escalation |
| `test_voice_clone_causes_high` | Clone detected in voice | At least HIGH risk |
| `test_challenge_failure_increases_risk` | All challenges failed | Risk score decreases by penalty |
| `test_recommendation_never_just_fraud` | Any result | All recommendations contain explanation text, not just "Fraud" |

#### `tests/unit/test_orchestrator.py`

| Test | Description | Expected Outcome |
|------|-------------|-----------------|
| `test_low_risk_only_runs_face` | Low initial context, face passes | Only face engine called |
| `test_medium_risk_runs_face_and_voice` | Face returns medium risk | Voice engine also called |
| `test_high_risk_runs_all_modules` | Multiple risk signals | Face + Voice + Behavioral all called |
| `test_escalation_triggers_correctly` | Face detects spoof | Immediate escalation to CRITICAL |
| `test_passport_issued_on_success` | Score ≥ 60 | Passport with valid signature returned |
| `test_passport_not_issued_on_critical` | Score < 40 | No passport, human_review=True |
| `test_timeline_events_recorded` | Complete verification | Timeline has ≥ 5 events with timestamps |
| `test_ai_summary_generated` | Any result | AI summary is non-empty string, human-readable |

#### `tests/unit/test_face_engine.py`

| Test | Description |
|------|-------------|
| `test_blink_detection_ear_threshold` | EAR below threshold → blink detected |
| `test_head_pose_looking_forward` | Pitch/Yaw/Roll near zero → looking_forward=True |
| `test_spoof_detection_low_variance` | Low Laplacian variance → print attack detected |
| `test_virtual_camera_obs_detected` | OBS label in device enumeration → virtual_cam=True |
| `test_multi_face_detection` | 2 faces in frame → multi_face_detected=True |
| `test_confidence_formula` | All passing → confidence ≥ 85 |

#### `tests/unit/test_voice_engine.py`

| Test | Description |
|------|-------------|
| `test_transcription_phrase_match` | Correct phrase → similarity ≥ 0.95 |
| `test_transcription_wrong_phrase` | Wrong phrase → similarity < 0.5 |
| `test_replay_detection_signals` | Flat spectral flatness → replay_detected=True |
| `test_clone_detection_tts_prosody` | Unnatural prosody → clone_probability high |
| `test_snr_below_minimum` | Low SNR audio → flagged as suspicious |

#### `tests/unit/test_behavioral_engine.py`

| Test | Description |
|------|-------------|
| `test_perfect_mouse_lines_detected` | Straight line events → bot_score high |
| `test_human_mouse_entropy` | Random human movement → entropy in normal range |
| `test_keyboard_exact_intervals` | 120ms exact dwell → automation detected |
| `test_vpn_asn_detected` | Known VPN ASN IP → vpn_detected=True |
| `test_selenium_fingerprint` | WebDriver present in fingerprint → automation=True |

#### `tests/unit/test_passport.py`

| Test | Description |
|------|-------------|
| `test_passport_issued_with_signature` | Valid session → passport has non-empty signature |
| `test_passport_expiry_respected` | Expired passport → validate returns False |
| `test_passport_revocation` | Revoked passport → validate returns False |
| `test_ecdsa_signature_verified` | Sign + verify → True |
| `test_hmac_demo_mode_signing` | Demo mode → HMAC signature valid |

#### `tests/unit/test_challenge_engine.py`

| Test | Description |
|------|-------------|
| `test_challenges_differ_per_session` | Different session IDs → different challenges |
| `test_same_session_same_challenges` | Same session ID → same challenges (deterministic) |
| `test_blink_challenge_validation` | blink_count ≥ 2 → pass |
| `test_voice_phrase_match` | >80% similarity → pass |
| `test_max_attempts_exceeded` | 3 failed attempts → ChallengeMaxAttemptsError |

---

### Integration Tests

#### `tests/integration/test_api_face.py`

```python
# Tests the face analysis API endpoint end-to-end with a mock image
async def test_submit_face_frame_demo_mode()
async def test_submit_face_frame_returns_result()
async def test_submit_face_no_session_returns_404()
async def test_submit_face_invalid_base64_returns_422()
```

#### `tests/integration/test_api_trust.py`

```python
async def test_start_verification_creates_session()
async def test_get_session_status()
async def test_complete_verification_flow_demo_mode()
async def test_passport_issued_after_verification()
async def test_dashboard_stats_returns_data()
```

#### `tests/integration/test_websockets.py`

```python
async def test_face_websocket_accepts_frames()
async def test_face_websocket_returns_results()
async def test_voice_websocket_accepts_audio()
async def test_websocket_disconnects_cleanly()
```

---

## Frontend Tests (Vitest)

### Setup

```bash
cd frontend

# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Files

#### `src/components/ui/__tests__/TrustMeter.test.tsx`

```typescript
describe('TrustMeter', () => {
  it('renders with correct score', ...)
  it('applies correct color for LOW risk', ...)
  it('applies correct color for CRITICAL risk', ...)
  it('animates count-up from 0', ...)
  it('shows pulsing ring when animated', ...)
})
```

#### `src/store/__tests__/verificationStore.test.ts`

```typescript
describe('verificationStore', () => {
  it('initializes with null session', ...)
  it('startSession sets session ID', ...)
  it('reset clears all state', ...)
  it('giveConsent sets consentGiven=true', ...)
})
```

#### `src/services/__tests__/trustService.test.ts`

```typescript
describe('trustService (demo mode)', () => {
  it('startVerification returns session ID', ...)
  it('getVerificationResult returns complete result', ...)
  it('result contains trust score', ...)
  it('result contains XAI factors', ...)
})
```

---

## End-to-End Tests (Playwright)

### Setup

```bash
cd frontend

# Install Playwright
npm install -D @playwright/test
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

### E2E Test Scenarios

#### `e2e/verification-flow.spec.ts`

```typescript
test('Complete verification flow in demo mode', async ({ page }) => {
  // 1. Navigate to /verify
  await page.goto('/verify')
  
  // 2. Accept consent
  await page.click('[data-testid="consent-accept"]')
  
  // 3. Face analysis starts automatically
  await expect(page.locator('[data-testid="face-panel"]')).toBeVisible()
  
  // 4. Wait for face analysis to complete (demo mode: ~3s)
  await page.waitForSelector('[data-testid="face-complete"]', { timeout: 10000 })
  
  // 5. Trust score is revealed
  await expect(page.locator('[data-testid="trust-score"]')).toBeVisible()
  
  // 6. Passport is issued
  await expect(page.locator('[data-testid="trust-passport"]')).toBeVisible()
})

test('Dashboard loads with demo data', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="stat-total-verifications"]')).toBeVisible()
  await expect(page.locator('[data-testid="risk-chart"]')).toBeVisible()
})

test('Chat is locked without passport', async ({ page }) => {
  await page.goto('/chat')
  await expect(page.locator('[data-testid="verification-gate"]')).toBeVisible()
  await expect(page.locator('[data-testid="chat-input"]')).not.toBeVisible()
})
```

---

## Manual Verification Checklist

### Face Engine
- [ ] Real person in front of webcam → Face detected, liveness PASS
- [ ] Hold up a photo of a face → Spoof detected (print attack)
- [ ] Cover camera → No face detected warning shown
- [ ] Two people in frame → Multiple faces detected alert
- [ ] Connect OBS virtual camera → Virtual camera indicator shown
- [ ] Close eyes for 2+ seconds → Unusual blink pattern flagged

### Voice Engine
- [ ] Read the displayed phrase correctly → Phrase match > 95%
- [ ] Playback a recording of yourself → Replay attack detected
- [ ] Use a noisy environment → Low SNR flagged
- [ ] Read wrong phrase → Mismatch flagged in results

### Behavioral Engine
- [ ] Use Selenium WebDriver → Automation detected
- [ ] Move mouse in perfect straight line → Bot-like movement flagged
- [ ] Enable VPN → VPN risk indicator shown
- [ ] Open browser DevTools → No effect (expected)

### Adaptive Verification
- [ ] Clean context → Only face analysis runs (LOW)
- [ ] Borderline face score → Voice step added automatically (MEDIUM)
- [ ] Multiple red flags → All steps run with challenges (HIGH)
- [ ] Spoof detected → CRITICAL, no passport issued

### Trust Passport
- [ ] Successful verification → Passport issued with valid signature
- [ ] Validate passport via API → Returns valid=True
- [ ] Wait for passport to expire → validate returns valid=False
- [ ] Access AI Chat with valid passport → Chat unlocked

### PDF Report
- [ ] Generate report after verification → PDF downloads
- [ ] PDF contains trust score → Visible in document
- [ ] PDF contains XAI factors → Each factor listed
- [ ] PDF contains audit timeline → Events with timestamps

### Security
- [ ] Rate limit: Send 11 verification requests/hour → 429 returned
- [ ] Invalid JWT → 401 returned
- [ ] Analyst role accessing admin endpoint → 403 returned
- [ ] Missing consent → Verification rejected

### Demo Mode
- [ ] Set DEMO_MODE=true → Yellow banner shown
- [ ] Complete full verification → No Azure calls made
- [ ] Dashboard loads → 30 days of realistic data
- [ ] PDF generates → Uses simulated data
- [ ] Chat works → Pre-crafted responses

---

## Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Face analysis (server) | < 500ms | Pytest timer |
| Voice analysis (server) | < 2000ms | Pytest timer |
| Trust score computation | < 100ms | Pytest timer |
| PDF generation | < 5000ms | Integration test |
| Dashboard page load | < 1500ms | Lighthouse |
| WebSocket frame latency | < 200ms | Manual measurement |
| Passport validation | < 50ms | Pytest timer |

---

## CI/CD Testing Gates

All PRs must pass:
- [ ] All unit tests (100% pass rate)
- [ ] All integration tests (100% pass rate)
- [ ] TypeScript type check (`tsc --noEmit`)
- [ ] ESLint (zero errors)
- [ ] Test coverage ≥ 70% for backend engines
- [ ] Lighthouse score ≥ 85 (performance, accessibility)
