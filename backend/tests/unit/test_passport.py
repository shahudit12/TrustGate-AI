import pytest
from app.passport.passport_signer import PassportSigner
from app.passport.passport_validator import PassportValidator
from app.passport.passport_service import PassportService
from app.models.schemas.trust import TrustScoreResult, RiskLevel, TrustComponent


def test_passport_signing_and_validation():
    signer = PassportSigner(secret_key="test_key")
    validator = PassportValidator(secret_key="test_key")

    payload = {"session_id": "sess_123", "overall_score": 95.0, "risk_level": "LOW"}
    token = signer.sign(payload)

    valid, decoded = validator.verify(token)
    assert valid is True
    assert decoded["session_id"] == "sess_123"
    assert decoded["overall_score"] == 95.0


def test_passport_tamper_validation_fails():
    signer = PassportSigner(secret_key="test_key")
    validator = PassportValidator(secret_key="different_key")

    payload = {"session_id": "sess_123", "overall_score": 95.0}
    token = signer.sign(payload)

    valid, decoded = validator.verify(token)
    assert valid is False
    assert decoded == {}


def test_passport_service_flow():
    service = PassportService()
    trust_res = TrustScoreResult(
        session_id="sess_abc",
        overall_score=88.5,
        risk_level=RiskLevel.LOW,
        face_component=TrustComponent(score=90.0, confidence=0.9, weight=0.4),
        recommendation="Proceed",
        requires_human_review=False
    )

    passport = service.generate_passport("sess_abc", trust_res)
    assert passport["session_id"] == "sess_abc"
    assert "signature_token" in passport

    valid = service.validate_passport(passport["signature_token"])
    assert valid is True

    # Test Bearer header parsing in validator
    bearer_token = f"Bearer {passport['signature_token']}"
    valid_bearer = service.validate_passport(bearer_token)
    assert valid_bearer is True


def test_passport_malformed_tokens():
    validator = PassportValidator(secret_key="test_key")

    assert validator.verify("")[0] is False
    assert validator.verify("invalid_token_no_dot")[0] is False
    assert validator.verify("Bearer invalid.token.three.dots")[0] is False
    assert validator.verify("invalid_base64.signature")[0] is False
