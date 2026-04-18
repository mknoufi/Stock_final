import re

with open("backend/api/sync_batch_api.py", "r") as f:
    content = f.read()

search = """    # Check for duplicate serial numbers
    if record.serial_numbers:
        for serial in record.serial_numbers:
            existing = await db.item_serials.find_one({"serial_number": serial})
            if existing and existing.get("client_record_id") != record.client_record_id:"""

replace = """    # Check for duplicate serial numbers
    if record.serial_numbers:
        # ⚡ Bolt: Fixed N+1 query. Fetched all existing serials in one query and mapped them.
        existing_serials_cursor = db.item_serials.find({"serial_number": {"$in": record.serial_numbers}})
        existing_serials_list = await existing_serials_cursor.to_list(length=None)
        existing_serials_map = {s.get("serial_number"): s for s in existing_serials_list}

        for serial in record.serial_numbers:
            existing = existing_serials_map.get(serial)
            if existing and existing.get("client_record_id") != record.client_record_id:"""

if search in content:
    content = content.replace(search, replace)
    with open("backend/api/sync_batch_api.py", "w") as f:
        f.write(content)
        print("Updated validate_record in backend/api/sync_batch_api.py")
else:
    print("Search string not found in validate_record")
