import { useEffect, useState, useCallback } from 'react';
import { useTrustStore } from '../store/trustStore';
import { TrustPassport, PassportValidationResult } from '../types/passport';

export function useTrustPassport() {
  const { passport, setPassport, clearTrust } = useTrustStore();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('');
  const [isPassportValid, setIsPassportValid] = useState<boolean>(false);

  const calculateExpiry = useCallback((expiresAt: string) => {
    const expiryDate = new Date(expiresAt).getTime();
    const now = Date.now();
    const diff = expiryDate - now;

    if (diff <= 0) {
      setIsPassportValid(false);
      return 'Expired';
    }

    setIsPassportValid(true);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }, []);

  useEffect(() => {
    if (!passport) {
      setIsPassportValid(false);
      return;
    }

    // Initial calculation
    setTimeUntilExpiry(calculateExpiry(passport.expiresAt));

    // Update countdown every second
    const interval = setInterval(() => {
      setTimeUntilExpiry(calculateExpiry(passport.expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [passport, calculateExpiry]);

  const storePassport = useCallback((newPassport: TrustPassport) => {
    // In a real app, this would be encrypted before storing in localStorage
    const serialized = btoa(JSON.stringify(newPassport));
    localStorage.setItem('trustgate_passport', serialized);
    setPassport(newPassport);
  }, [setPassport]);

  const loadPassport = useCallback(() => {
    try {
      const stored = localStorage.getItem('trustgate_passport');
      if (stored) {
        const decoded: TrustPassport = JSON.parse(atob(stored));
        if (new Date(decoded.expiresAt).getTime() > Date.now()) {
          setPassport(decoded);
          return decoded;
        } else {
          localStorage.removeItem('trustgate_passport');
        }
      }
    } catch (e) {
      console.error('Failed to load passport', e);
    }
    return null;
  }, [setPassport]);

  const clearPassport = useCallback(() => {
    localStorage.removeItem('trustgate_passport');
    clearTrust();
  }, [clearTrust]);

  const validatePassport = async (passportId: string): Promise<PassportValidationResult> => {
    // Simulated remote validation
    return new Promise(resolve => {
      setTimeout(() => {
        if (passport && passport.passportId === passportId) {
          const isExpired = new Date(passport.expiresAt).getTime() <= Date.now();
          resolve({ isValid: !isExpired, isExpired, passport });
        } else {
          resolve({ isValid: false, isExpired: false, error: 'Passport not found or invalid' });
        }
      }, 500);
    });
  };

  return {
    passport,
    isPassportValid,
    timeUntilExpiry,
    storePassport,
    loadPassport,
    clearPassport,
    validatePassport
  };
}
