import re

with open("backend/api/sync_batch_api.py", "r") as f:
    content = f.read()

search = """    try:
        # Validate all records first
        for record in request.records:
            # Check idempotency first using client_record_id as operation_id
            existing_op = await db.idempotency_operations.find_one(
                {"operation_id": record.client_record_id}
            )
            if existing_op:
                ok_records.append(record.client_record_id)
                continue"""

replace = """    try:
        # Validate all records first
        # ⚡ Bolt: Fixed N+1 query. Fetched all idempotency ops in a single query.
        all_record_ids = [r.client_record_id for r in request.records]
        ops_cursor = db.idempotency_operations.find({"operation_id": {"$in": all_record_ids}})
        existing_ops_list = await ops_cursor.to_list(length=None)
        existing_ops_set = {op.get("operation_id") for op in existing_ops_list}

        for record in request.records:
            # Check idempotency first using client_record_id as operation_id
            if record.client_record_id in existing_ops_set:
                ok_records.append(record.client_record_id)
                continue"""

if search in content:
    content = content.replace(search, replace)
    with open("backend/api/sync_batch_api.py", "w") as f:
        f.write(content)
        print("Updated sync_batch in backend/api/sync_batch_api.py")
else:
    print("Search string not found in sync_batch")
