import os
import base64
import json
import hmac
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

class EncryptionService:
    @staticmethod
    def generate_aes_key() -> bytes:
        return AESGCM.generate_key(bit_length=256)
        
    @staticmethod
    def encrypt_aes_gcm(key: bytes, plaintext: bytes) -> tuple[bytes, bytes]:
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        return nonce, ciphertext

    @staticmethod
    def decrypt_aes_gcm(key: bytes, nonce: bytes, ciphertext: bytes) -> bytes:
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, ciphertext, None)

    @staticmethod
    def generate_ecdsa_key_pair():
        private_key = ec.generate_private_key(ec.SECP256R1())
        public_key = private_key.public_key()
        priv_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        pub_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return priv_pem, pub_pem

    @staticmethod
    def sign_ecdsa(private_key_pem: bytes, data: bytes) -> bytes:
        private_key = serialization.load_pem_private_key(private_key_pem, password=None)
        signature = private_key.sign(data, ec.ECDSA(hashes.SHA256()))
        return signature

    @staticmethod
    def verify_ecdsa(public_key_pem: bytes, signature: bytes, data: bytes) -> bool:
        public_key = serialization.load_pem_public_key(public_key_pem)
        try:
            public_key.verify(signature, data, ec.ECDSA(hashes.SHA256()))
            return True
        except InvalidSignature:
            return False

    @staticmethod
    def sign_hmac_sha256(key: bytes, data: bytes) -> bytes:
        return hmac.new(key, data, hashlib.sha256).digest()

    @staticmethod
    def verify_hmac_sha256(key: bytes, signature: bytes, data: bytes) -> bool:
        expected = EncryptionService.sign_hmac_sha256(key, data)
        return hmac.compare_digest(expected, signature)\n