from fastapi import Request, HTTPException
from time import time
from typing import Dict, List

class RateLimiter:
    def __init__(self, requests: int, window_seconds: int):
        self.requests = requests
        self.window_seconds = window_seconds
        self.store: Dict[str, List[float]] = {}
        
    def check(self, key: str) -> bool:
        now = time()
        if key not in self.store:
            self.store[key] = []
        
        # Remove old requests
        self.store[key] = [t for t in self.store[key] if now - t < self.window_seconds]
        
        if len(self.store[key]) >= self.requests:
            return False
            
        self.store[key].append(now)
        return True

def rate_limit_dependency(request: Request):
    # Setup rate limiter: 100 requests per 60 seconds
    limiter = RateLimiter(requests=100, window_seconds=60)
    
    # Use client IP as key. In production, use real IP or API key.
    client_ip = request.client.host if request.client else "unknown"
    if not limiter.check(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too Many Requests",
            headers={"Retry-After": "60"}
        )\n