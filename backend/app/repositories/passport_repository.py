from typing import Dict, Any, Optional, List


class PassportRepository:
    """
    Repository for persisting and querying issued Trust Passports.
    """
    def __init__(self):
        self._passports: Dict[str, Dict[str, Any]] = {}

    def save(self, passport_id: str, passport_data: Dict[str, Any]) -> Dict[str, Any]:
        self._passports[passport_id] = passport_data
        return passport_data

    def get(self, passport_id: str) -> Optional[Dict[str, Any]]:
        return self._passports.get(passport_id)

    def find_by_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        for passport in self._passports.values():
            if passport.get("session_id") == session_id:
                return passport
        return None

    def list_all(self, risk_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        passports = list(self._passports.values())
        if risk_filter and risk_filter.upper() != "ALL":
            passports = [p for p in passports if p.get("risk") == risk_filter.upper() or p.get("risk_level") == risk_filter.upper()]
        return passports


passport_repository = PassportRepository()
