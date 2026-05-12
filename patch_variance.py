import re

with open('backend/api/report_generation_api.py', 'r') as f:
    content = f.read()

old_block = """    # ⚡ Bolt: Fixed N+1 query. Fetched lines first, then fetch only related items to avoid O(N) memory
    lines_cursor = db.count_lines.find(line_query)
    lines = await lines_cursor.to_list(length=None)
    item_codes = list({line.get("item_code") for line in lines if line.get("item_code")})

    item_docs: dict[str, Any] = {}
    if item_codes:
        item_query["item_code"] = {"$in": item_codes}
        item_docs = {
            item.get("item_code"): item
            async for item in db.erp_items.find(item_query)
            if item.get("item_code")
        }

    if (filters.warehouse or filters.floor or filters.category) and not item_docs:
        return []"""

new_block = """    # ⚡ Bolt: Fixed N+1 query. First check if filtering items to avoid fetching all count_lines
    # If item filters are provided, we should ensure there are items matching the criteria before proceeding.
    item_codes_filter = None
    if filters.warehouse or filters.floor or filters.category:
        filtered_items = await db.erp_items.find(item_query, {"item_code": 1}).to_list(length=None)
        if not filtered_items:
            return []
        item_codes_filter = [item.get("item_code") for item in filtered_items if item.get("item_code")]
        if not item_codes_filter:
            return []
        line_query["item_code"] = {"$in": item_codes_filter}

    lines_cursor = db.count_lines.find(line_query)
    lines = await lines_cursor.to_list(length=None)

    # Extract item codes we actually need
    needed_item_codes = list({line.get("item_code") for line in lines if line.get("item_code")})

    item_docs: dict[str, Any] = {}
    if needed_item_codes:
        item_query["item_code"] = {"$in": needed_item_codes}
        item_docs = {
            item.get("item_code"): item
            async for item in db.erp_items.find(item_query)
            if item.get("item_code")
        }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('backend/api/report_generation_api.py', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find block to patch")
