import pytest
from datetime import datetime, timezone

from backend.services.otp_service import OTPService


@pytest.fixture
def otp_service(test_db):
    return OTPService(test_db)


@pytest.mark.asyncio
async def test_initialize(otp_service):
    """Test service initialization and index creation"""
    # Should not raise any exception
    await otp_service.initialize()


def test_generate_otp_code(otp_service):
    """Test OTP code generation"""
    code = otp_service.generate_otp_code()
    assert len(code) == 6
    assert code.isdigit()

    code_length_4 = otp_service.generate_otp_code(4)
    assert len(code_length_4) == 4
    assert code_length_4.isdigit()


@pytest.mark.asyncio
async def test_create_otp(otp_service, test_db):
    """Test creating a new OTP"""
    user_id = "user123"

    # Create first OTP
    code1 = await otp_service.create_otp(user_id)
    assert len(code1) == 6

    # Verify stored in DB
    otp_doc = await test_db.auth_otps.find_one({"user_id": user_id})
    assert otp_doc is not None
    assert otp_doc["code"] == code1
    assert otp_doc["attempts"] == 0
    assert otp_doc["expires_at"] > datetime.now(timezone.utc).replace(tzinfo=None)

    # Create second OTP (should replace first)
    code2 = await otp_service.create_otp(user_id)

    # Verify only one OTP exists for user
    docs = await test_db.auth_otps.find({"user_id": user_id}).to_list(length=10)
    assert len(docs) == 1
    assert docs[0]["code"] == code2


@pytest.mark.asyncio
async def test_verify_otp_success(otp_service, test_db):
    """Test successful OTP verification"""
    user_id = "user_verify"
    code = await otp_service.create_otp(user_id)

    success, message = await otp_service.verify_otp(user_id, code)
    assert success is True
    assert message == "Success"

    # OTP should be deleted after use
    otp_doc = await test_db.auth_otps.find_one({"user_id": user_id})
    assert otp_doc is None


@pytest.mark.asyncio
async def test_verify_otp_not_found(otp_service):
    """Test verification with no OTP"""
    success, message = await otp_service.verify_otp("non_existent_user", "123456")
    assert success is False
    assert message == "OTP not found or expired"


@pytest.mark.asyncio
async def test_verify_otp_invalid_code(otp_service, test_db):
    """Test verification with wrong code"""
    user_id = "user_invalid_code"
    await otp_service.create_otp(user_id)

    # First attempt
    success, message = await otp_service.verify_otp(user_id, "000000")
    assert success is False
    assert message == "Invalid OTP code"

    # Check attempts incremented
    otp_doc = await test_db.auth_otps.find_one({"user_id": user_id})
    assert otp_doc["attempts"] == 1


@pytest.mark.asyncio
async def test_verify_otp_max_attempts(otp_service, test_db):
    """Test lockout after max attempts"""
    user_id = "user_max_attempts"
    await otp_service.create_otp(user_id)

    # Manually set attempts to 5
    await test_db.auth_otps.update_one(
        {"user_id": user_id},
        {"$set": {"attempts": 5}}
    )

    # Verify attempt
    success, message = await otp_service.verify_otp(user_id, "123456") # Code doesn't matter
    assert success is False
    assert "Too many failed attempts" in message

    # OTP should be deleted
    otp_doc = await test_db.auth_otps.find_one({"user_id": user_id})
    assert otp_doc is None


@pytest.mark.asyncio
async def test_create_reset_token(otp_service, test_db):
    """Test creating reset token"""
    user_id = "user_reset"
    token = await otp_service.create_reset_token(user_id)

    assert len(token) > 0

    # Verify in DB
    token_doc = await test_db.auth_reset_tokens.find_one({"token": token})
    assert token_doc is not None
    assert token_doc["user_id"] == user_id
    assert token_doc["expires_at"] > datetime.now(timezone.utc).replace(tzinfo=None)


@pytest.mark.asyncio
async def test_validate_reset_token_success(otp_service):
    """Test valid reset token validation"""
    user_id = "user_validate"
    token = await otp_service.create_reset_token(user_id)

    returned_user_id = await otp_service.validate_reset_token(token)
    assert returned_user_id == user_id

    # Token should be consumed (deleted)
    returned_user_id_2 = await otp_service.validate_reset_token(token)
    assert returned_user_id_2 is None


@pytest.mark.asyncio
async def test_validate_reset_token_invalid(otp_service):
    """Test invalid reset token"""
    result = await otp_service.validate_reset_token("invalid_token")
    assert result is None
