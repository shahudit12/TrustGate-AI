from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class MouseEvent(BaseModel):
    x: float = 0.0
    y: float = 0.0
    timestamp: float = 0.0
    event_type: str = "mousemove"


class KeyboardEvent(BaseModel):
    key_code: str = "KeyA"
    dwell_ms: float = 110.0
    flight_ms: float = 140.0
    timestamp: float = 0.0


class BrowserFingerprint(BaseModel):
    user_agent: str = "Mozilla/5.0"
    screen_res: str = "1920x1080"
    timezone: str = "UTC"
    languages: List[str] = Field(default_factory=lambda: ["en-US"])
    plugins_hash: str = "hash"
    canvas_hash: str = "hash"
    webgl_hash: str = "hash"
    fonts_hash: str = "hash"


class DeviceInfo(BaseModel):
    platform: str = "Win32"
    touch_points: int = 0
    device_memory: float = 8.0
    hardware_concurrency: int = 8
    connection_type: str = "wifi"


class BehavioralAnalysisRequest(BaseModel):
    session_id: str = Field(default="sess_demo")
    mouse_events: List[MouseEvent] = Field(default_factory=list)
    keyboard_events: List[KeyboardEvent] = Field(default_factory=list)
    fingerprint: Optional[BrowserFingerprint] = Field(default_factory=BrowserFingerprint)
    device_info: Optional[DeviceInfo] = Field(default_factory=DeviceInfo)
    focus_events: List[dict] = Field(default_factory=list)
    tab_switches: int = 0


class MouseAnalysisResult(BaseModel):
    entropy: float = 0.85
    avg_velocity: float = 150.0
    movement_pattern: str = "NATURAL"
    is_human: bool = True


class KeyboardAnalysisResult(BaseModel):
    rhythm_consistency: float = 0.92
    avg_dwell: float = 110.0
    avg_flight: float = 140.0
    is_human: bool = True


class VPNDetectionResult(BaseModel):
    vpn_detected: bool = False
    proxy_detected: bool = False
    tor_detected: bool = False
    ip_risk_score: float = 0.05
    asn: str = "AS12345"
    country: str = "US"


class AutomationDetectionResult(BaseModel):
    is_automated: bool = False
    automation_type: str = "NONE"
    confidence: float = 0.99
    signals: List[str] = Field(default_factory=list)


class BehavioralAnalysisResult(BaseModel):
    typing_dynamics: Dict[str, Any] = Field(default_factory=lambda: {"rhythm_consistency": 0.92, "avg_dwell_ms": 110.0, "avg_flight_ms": 140.0, "is_human": True})
    mouse_movement_score: float = Field(default=0.95, json_schema_extra={"example": 0.95})
    anomaly_score: float = Field(default=0.05, json_schema_extra={"example": 0.05})
    explanation: str = Field(default="Mouse velocity curve and keyboard dwell/flight dynamics exhibit natural human entropy.", json_schema_extra={"example": "Natural human entropy."})

    # Extended legacy / detailed attributes
    mouse: Optional[MouseAnalysisResult] = None
    keyboard: Optional[KeyboardAnalysisResult] = None
    vpn: Optional[VPNDetectionResult] = None
    automation: Optional[AutomationDetectionResult] = None
    overall_confidence: float = 0.95
    risk_factors: List[str] = Field(default_factory=list)