from pydantic import BaseModel, Field
from typing import List, Optional


class VoiceAnalysisRequest(BaseModel):
    audio_base64: str = Field(default="demo_audio")
    session_id: str = Field(default="sess_demo")
    expected_phrase: Optional[str] = Field(default="My voice is my cryptographic biometric passport")


class TranscriptionResult(BaseModel):
    text: str = "My voice is my cryptographic biometric passport"
    confidence: float = 0.98
    language: str = "en-US"


class SpeakerVerificationResult(BaseModel):
    is_match: bool = True
    similarity_score: float = 0.96
    embedding_distance: float = 0.08


class ReplayDetectionResult(BaseModel):
    is_replay: bool = False
    spectral_anomaly_score: float = 0.02
    indicators: List[str] = Field(default_factory=list)


class CloneDetectionResult(BaseModel):
    is_clone: bool = False
    clone_probability: float = 0.03
    artifacts_detected: List[str] = Field(default_factory=list)


class NoiseAnalysisResult(BaseModel):
    snr_db: float = 28.5
    noise_level: str = "LOW"
    environment_type: str = "QUIET_INDOOR"


class VoiceAnalysisResult(BaseModel):
    speaker_confidence: float = Field(default=0.96, json_schema_extra={"example": 0.96})
    spoof_probability: float = Field(default=0.03, json_schema_extra={"example": 0.03})
    speech_quality: float = Field(default=0.95, json_schema_extra={"example": 0.95})
    transcript: str = Field(default="My voice is my cryptographic biometric passport", json_schema_extra={"example": "My voice is my cryptographic biometric passport"})
    explanation: str = Field(default="Neural vocal acoustic spectrogram matched registered biometric baseline.", json_schema_extra={"example": "Matched voice baseline."})

    # Extended legacy / detailed attributes
    transcription: Optional[TranscriptionResult] = None
    speaker_verification: Optional[SpeakerVerificationResult] = None
    replay: Optional[ReplayDetectionResult] = None
    clone: Optional[CloneDetectionResult] = None
    noise: Optional[NoiseAnalysisResult] = None
    overall_confidence: float = 0.96
    processing_time_ms: float = 240.0