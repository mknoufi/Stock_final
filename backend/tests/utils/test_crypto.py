from passlib.context import CryptContext

# Replicate the context config from pin_auth_service.py
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def test_hash_generation():
    pin = "1234"
    hashed = pwd_context.hash(pin)
    assert hashed is not None
    assert hashed != pin
    assert len(hashed) > 10


def test_hash_verification_success():
    pin = "5678"
    hashed = pwd_context.hash(pin)
    assert pwd_context.verify(pin, hashed) is True


def test_hash_verification_failure():
    pin = "0000"
    hashed = pwd_context.hash(pin)
    assert pwd_context.verify("1111", hashed) is False


def test_hashing_is_salted():
    """Ensure same pin produces different hashes (salting)"""
    pin = "8888"
    hash1 = pwd_context.hash(pin)
    hash2 = pwd_context.hash(pin)
    assert hash1 != hash2
    assert pwd_context.verify(pin, hash1) is True
    assert pwd_context.verify(pin, hash2) is True
