import requests

from backend.scripts import sync_bridge_agent as agent


def test_connect_with_retry_retries_until_success(monkeypatch):
    monkeypatch.setenv("SYNC_RETRY_ATTEMPTS", "3")
    monkeypatch.setenv("SYNC_RETRY_MIN_SECONDS", "0")
    monkeypatch.setenv("SYNC_RETRY_MAX_SECONDS", "0")

    class DummyConnector:
        def __init__(self):
            self.attempts = 0

        def connect(self, **_kwargs):
            self.attempts += 1
            return self.attempts >= 3

    connector = DummyConnector()

    connected = agent._connect_with_retry(
        connector=connector,
        host="localhost",
        port=1433,
        database="db",
        user="user",
        password="password",
    )

    assert connected is True
    assert connector.attempts == 3


def test_post_batch_with_retry_retries_request_exception(monkeypatch):
    monkeypatch.setenv("SYNC_RETRY_ATTEMPTS", "3")
    monkeypatch.setenv("SYNC_RETRY_MIN_SECONDS", "0")
    monkeypatch.setenv("SYNC_RETRY_MAX_SECONDS", "0")

    call_count = {"value": 0}

    class Response:
        status_code = 200

        @staticmethod
        def json():
            return {"stats": {"synced": 1}}

        text = "ok"

    def fake_post(*_args, **_kwargs):
        call_count["value"] += 1
        if call_count["value"] < 3:
            raise requests.RequestException("temporary failure")
        return Response()

    monkeypatch.setattr(agent.requests, "post", fake_post)

    response = agent._post_batch_with_retry(
        api_url="http://localhost:8001/api/erp/sync/batch",
        json_data="[]",
        sync_key="token",
    )

    assert response.status_code == 200
    assert call_count["value"] == 3
