import pytest
from unittest.mock import MagicMock, AsyncMock
from backend.services.data_governance import DataGovernanceService

@pytest.fixture
def mock_db():
    db = MagicMock()

    # Store created collections to ensure consistency
    collections = {}

    def get_collection(name):
        if name not in collections:
            collection = MagicMock()
            collection.insert_one = AsyncMock()
            collection.insert_many = AsyncMock()
            collection.update_one = AsyncMock()
            collection.delete_many = AsyncMock()
            collection.find_one = AsyncMock()
            collection.find = MagicMock()
            collection.count_documents = AsyncMock(return_value=0)
            collection.create_index = AsyncMock()
            collections[name] = collection
        return collections[name]

    # Mock __getitem__ for db[collection_name]
    db.__getitem__ = MagicMock(side_effect=get_collection)

    def get_attr(name):
        if name.startswith("_"):
            raise AttributeError(name)
        return get_collection(name)

    db.data_retention_policies = get_collection("data_retention_policies")
    db.data_subject_requests = get_collection("data_subject_requests")
    db.data_archive = get_collection("data_archive")

    db.list_collection_names = AsyncMock(return_value=[])

    return db

@pytest.fixture
def service(mock_db):
    return DataGovernanceService(mock_db)

@pytest.mark.asyncio
async def test_get_data_inventory_optimized(service, mock_db):
    # Setup 10 collections
    collections = [f"collection_{i}" for i in range(10)]
    mock_db.list_collection_names.return_value = collections

    # Mock policies return
    # We want policies for some collections
    policies = [
        {"collection_name": "collection_0", "retention_days": 30},
        {"collection_name": "collection_5", "retention_days": 60},
    ]

    async def async_iter(items):
        for item in items:
            yield item

    # Mock find() to return an async iterable cursor
    cursor = MagicMock()
    cursor.__aiter__.side_effect = lambda: async_iter(policies)
    mock_db.data_retention_policies.find.return_value = cursor

    # Run the method
    inventory = await service.get_data_inventory()

    # Assert find_one was NOT called for policy lookup
    assert mock_db.data_retention_policies.find_one.call_count == 0

    # Assert find was called once to fetch all policies
    assert mock_db.data_retention_policies.find.call_count == 1

    # Verify results
    assert len(inventory) == 10
    assert inventory["collection_0"]["has_retention_policy"] is True
    assert inventory["collection_0"]["retention_days"] == 30
    assert inventory["collection_1"]["has_retention_policy"] is False
    assert inventory["collection_5"]["has_retention_policy"] is True
    assert inventory["collection_5"]["retention_days"] == 60
