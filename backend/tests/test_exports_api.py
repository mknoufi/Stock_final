import base64
from datetime import datetime, timezone

import pytest
from bson import ObjectId

from backend.api.exports_api import download_export_result


class _FakeExportResultsCollection:
    def __init__(self, document):
        self.document = document

    async def find_one(self, query):
        if query.get("_id") == self.document["_id"]:
            return self.document
        return None


class _FakeDb:
    def __init__(self, document):
        self.export_results = _FakeExportResultsCollection(document)


class _FakeExportService:
    def __init__(self, document):
        self.db = _FakeDb(document)


@pytest.mark.asyncio
async def test_download_export_result_decodes_xlsx_payload():
    export_id = ObjectId()
    binary_payload = b"xlsx-binary-content"
    document = {
        "_id": export_id,
        "file_content": base64.b64encode(binary_payload).decode("utf-8"),
        "file_extension": "xlsx",
        "schedule_name": "weekly_export",
        "created_at": datetime(2026, 3, 15, 8, 30, tzinfo=timezone.utc),
    }

    response = await download_export_result(
        str(export_id),
        export_service=_FakeExportService(document),
        current_user={"username": "admin"},
    )

    assert (
        response.media_type
        == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    assert response.body == binary_payload
    assert 'filename="weekly_export_' in response.headers["content-disposition"]
    assert response.headers["content-disposition"].endswith('.xlsx"')


@pytest.mark.asyncio
async def test_download_export_result_returns_csv_content_as_text():
    export_id = ObjectId()
    csv_payload = "name,count\nwidget,2\n"
    document = {
        "_id": export_id,
        "file_content": csv_payload,
        "file_extension": "csv",
        "schedule_name": "daily_counts",
        "created_at": datetime(2026, 3, 15, 8, 30, tzinfo=timezone.utc),
    }

    response = await download_export_result(
        str(export_id),
        export_service=_FakeExportService(document),
        current_user={"username": "admin"},
    )

    assert response.media_type == "text/csv"
    assert response.body == csv_payload.encode("utf-8")
    assert response.headers["content-disposition"].endswith('.csv"')
