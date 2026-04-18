import re

with open("backend/api/sync_batch_api.py", "r") as f:
    content = f.read()

search = """    ordered_ops = sorted(operations, key=lambda op: op.timestamp or "")

    for op in ordered_ops:
        success = False
        message: Optional[str] = None

        try:
            # Check idempotency
            existing_op = await db.idempotency_operations.find_one({"operation_id": op.id})
            if existing_op:
                success = True
                message = "Already processed (idempotency)"
            else:"""

replace = """    ordered_ops = sorted(operations, key=lambda op: op.timestamp or "")

    # ⚡ Bolt: Fixed N+1 query. Fetched all legacy idempotency ops in a single query.
    all_op_ids = [op.id for op in operations]
    legacy_ops_cursor = db.idempotency_operations.find({"operation_id": {"$in": all_op_ids}})
    existing_legacy_ops_list = await legacy_ops_cursor.to_list(length=None)
    existing_legacy_ops_set = {doc.get("operation_id") for doc in existing_legacy_ops_list}

    for op in ordered_ops:
        success = False
        message: Optional[str] = None

        try:
            # Check idempotency
            if op.id in existing_legacy_ops_set:
                success = True
                message = "Already processed (idempotency)"
            else:"""

if search in content:
    content = content.replace(search, replace)
    with open("backend/api/sync_batch_api.py", "w") as f:
        f.write(content)
        print("Updated _process_legacy_operations in backend/api/sync_batch_api.py")
else:
    print("Search string not found in _process_legacy_operations")
