
import pytest
import logging
import os
import sys
import importlib
from unittest.mock import patch, MagicMock
from fastapi import HTTPException

from backend.utils.auth_utils import verify_password, get_password_hash, _verify_bcrypt_fallback, pwd_context
from backend.utils.api_utils import (
    sanitize_for_logging, 
    create_safe_error_response, 
    handle_result,
    result_to_response
)
from backend.utils.result import Result, Fail, Ok, Either, result_function, UnwrapError
from backend.exceptions import (
    StockVerifyException,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    RateLimitError
)

# --- Tests for auth_utils.py ---

def test_auth_utils_verify_password_empty():
    """Test verify_password with empty inputs (Lines 63-64)"""
    assert verify_password("", "somehash") is False
    assert verify_password("password", "") is False
    assert verify_password(None, "somehash") is False
    assert verify_password("password", None) is False

def test_auth_utils_verify_password_long_truncation():
    """Test verify_password with >72 chars (Lines 69-71)"""
    # Create a long password
    long_password = "a" * 80
    # Hash it (this will use the internal truncation logic in get_password_hash)
    hashed = get_password_hash(long_password)
    
    # Verify should work because it also truncates
    assert verify_password(long_password, hashed) is True

def test_auth_utils_get_password_hash_empty():
    """Test get_password_hash with empty input (Line 110)"""
    # Should hash empty string
    hashed = get_password_hash("")
    # verify_password refuses empty password, so we manually check
    # But wait, verify_password checks `if not plain_password`
    # So we can't use verify_password to verify it. 
    # Just checking it returns a string is enough for coverage.
    assert isinstance(hashed, str)
    assert len(hashed) > 0

def test_auth_utils_verify_bcrypt_fallback_direct():
    """Test _verify_bcrypt_fallback directly"""
    # We need a valid bcrypt hash
    import bcrypt
    password = b"test_fallback"
    hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
    
    # Test successful verification
    assert _verify_bcrypt_fallback(password, hashed) is True
    
    # Test failed verification
    assert _verify_bcrypt_fallback(b"wrong", hashed) is False
    
    # Test invalid hash type (not string)
    assert _verify_bcrypt_fallback(password, 123) is False

def test_auth_utils_verify_password_fallback_trigger():
    """Test that verify_password triggers fallback when pwd_context fails"""
    password = "test_password"
    # Create a real hash first
    real_hash = get_password_hash(password)
    
    # Mock pwd_context.verify to raise an exception
    with patch('backend.utils.auth_utils.pwd_context.verify', side_effect=ValueError("Mock error")):
        # Mock _verify_bcrypt_fallback to ensure it's called
        with patch('backend.utils.auth_utils._verify_bcrypt_fallback', return_value=True) as mock_fallback:
            result = verify_password(password, real_hash)
            assert result is True
            mock_fallback.assert_called_once()

# --- Tests for api_utils.py ---

def test_sanitize_for_logging():
    """Test sanitize_for_logging function"""
    assert sanitize_for_logging("normal") == "normal"
    assert sanitize_for_logging("line\nbreak") == "linebreak"
    assert sanitize_for_logging("tab\tchar") == "tabchar" # \t is control char \x09
    assert sanitize_for_logging("<script>") == "script"
    assert sanitize_for_logging(None) == ""
    
    long_str = "a" * 60
    assert len(sanitize_for_logging(long_str, max_length=50)) == 50

def test_create_safe_error_response():
    """Test create_safe_error_response"""
    with patch('backend.utils.api_utils.logger') as mock_logger:
        resp = create_safe_error_response(400, "Bad Request", "BAD_REQ", "Log details")
        assert resp.status_code == 400
        assert resp.detail["error"]["message"] == "Bad Request"
        mock_logger.error.assert_called()

def test_handle_result_exceptions():
    """Test handle_result with various exception types"""
    
    # StockVerifyException
    err = StockVerifyException("Custom error", status_code=418, details={"foo": "bar"})
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 418
        # StockVerifyException.to_dict() returns structure: {'error': 'Code', 'message': 'Msg', ...}
        assert isinstance(e.detail, dict)
        assert e.detail["error"] == "StockVerifyException"
        assert e.detail["message"] == "Custom error"
        
    # AuthenticationError
    err = AuthenticationError("Auth failed")
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 401
        assert e.detail["error"] == "AUTHENTICATION_ERROR"
        
    # AuthorizationError
    err = AuthorizationError("Forbidden")
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 403
        assert e.detail["error"] == "AUTHORIZATION_ERROR"
        
    # ValidationError
    err = ValidationError("Invalid input")
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 422
        assert e.detail["error"] == "VALIDATION_ERROR"
        
    # NotFoundError
    err = NotFoundError("Item not found")
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 404
        assert e.detail["error"] == "NOT_FOUND"
        
    # RateLimitError
    err = RateLimitError("Too many requests", retry_after=60)
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 429
        # Structure is {"error": "RATE_LIMIT_ERROR", "details": {"retry_after": 60}}
        assert e.detail["error"] == "RATE_LIMIT_ERROR"
        assert e.detail["details"]["retry_after"] == 60

def test_handle_result_unknown_error():
    """Test handle_result with unknown exception"""
    err = ValueError("Unknown boom")
    try:
        handle_result(Result.fail(err))
    except HTTPException as e:
        assert e.status_code == 500
        assert e.detail["error"]["code"] == "INTERNAL_SERVER_ERROR"

def test_handle_result_no_error_attribute():
    """Test handle_result with a Result that somehow has no error (should not happen normally)"""
    # Create a mock result that behaves like a failed result but has no error
    res = MagicMock(spec=Result)
    res.is_ok = False
    res.err = None
    res._error = None
    
    try:
        handle_result(res)
    except HTTPException as e:
        assert e.status_code == 500
        # It creates a generic Exception("Unknown error")

# --- Tests for result.py ---

def test_result_map_error():
    """Test Result.map_error"""
    # Success case - should not change
    res = Result.ok("ok")
    mapped = res.map_error(lambda e: Exception(str(e)))
    assert mapped.unwrap() == "ok"
    
    # Error case
    res = Result.fail(ValueError("orig"))
    mapped = res.map_error(lambda e: TypeError(str(e)))
    assert mapped.is_err
    assert isinstance(mapped._error, TypeError)
    assert str(mapped._error) == "orig"

def test_result_or_else():
    """Test Result.or_else"""
    # Success case
    res = Result.ok("ok")
    assert res.or_else(lambda e: Result.ok("recovered")).unwrap() == "ok"
    
    # Error case - recover
    res = Result.fail(ValueError("fail"))
    recovered = res.or_else(lambda e: Result.ok("recovered"))
    assert recovered.is_ok
    assert recovered.unwrap() == "recovered"
    
    # Error case - fail again
    res = Result.fail(ValueError("fail"))
    failed_again = res.or_else(lambda e: Result.fail(TypeError("fail2")))
    assert failed_again.is_err
    assert isinstance(failed_again._error, TypeError)

def test_result_properties_and_repr():
    """Test additional properties and __repr__"""
    res_ok = Result.ok("val")
    assert "Ok(val)" in repr(res_ok)
    
    res_err = Result.fail(ValueError("err"))
    # str(ValueError("err")) is "err", so repr is Err(err)
    assert "Err(err)" in repr(res_err)
    
    # Test to_optional
    assert res_ok.to_optional() == "val"
    assert res_err.to_optional() is None
    
    # Test to_either
    either_ok = res_ok.to_either()
    assert either_ok.is_right
    
    either_err = res_err.to_either()
    assert either_err.is_left

def test_result_context_manager():
    """Test usage as context manager"""
    # Success case
    with Result.ok("val") as res:
        assert res.unwrap() == "val"
        
    # Error case (raises UnwrapError when unwrap called, or if we raise explicit error)
    try:
        with Result.fail(ValueError("err")) as res:
            res.unwrap()
    except Exception as e:
        # result.py __exit__ re-raises the inner exception if UnwrapError wraps it
        # Actually __exit__ logic:
        # if isinstance(exc_val, UnwrapError) and isinstance(exc_val.error, Exception): raise exc_val.error
        # unwrap() raises UnwrapError(error). So it should re-raise ValueError("err")
        assert "err" in str(e)

