import re

with open("backend/api/dashboard_analytics_api.py", "r") as f:
    content = f.read()

# Replace _breakdown_by_session
session_pattern = r'''async def _breakdown_by_session\(
    db: AsyncIOMotorDatabase, valuation_basis: str
\) -> List\[BreakdownItem\]:
    """Breakdown by individual sessions"""
    sessions = await db\.sessions\.find\(\{"status": \{"\$in": \["OPEN", "ACTIVE", "CLOSED"\]\}\}\)\.to_list\(
        None
    \)

    breakdown = \[\]
    for session in sessions\[:20\]:  # Limit to 20 most recent sessions
        session_id = session\.get\("id"\)
        count_lines = await db\.count_lines\.find\(\{"session_id": session_id\}\)\.to_list\(None\)

        if not count_lines:
            continue

        # Calculate metrics
        total_counted = sum\(line\.get\("counted_qty", 0\) for line in count_lines\)
        total_expected = sum\(line\.get\("erp_qty", 0\) for line in count_lines\)

        # Get prices
        item_codes = \[line\.get\("item_code"\) for line in count_lines\]
        items = await db\.erp_items\.find\(\{"item_code": \{"\$in": item_codes\}\}\)\.to_list\(None\)
        price_map = \{
            item\["item_code"\]: item\.get\(valuation_basis, 0\) or item\.get\("mrp", 0\) for item in items
        \}'''

session_replacement = '''async def _breakdown_by_session(
    db: AsyncIOMotorDatabase, valuation_basis: str
) -> List[BreakdownItem]:
    """Breakdown by individual sessions"""
    sessions = await db.sessions.find({"status": {"$in": ["OPEN", "ACTIVE", "CLOSED"]}}).to_list(
        None
    )
    sessions = sessions[:20]  # Limit to 20 most recent sessions

    breakdown = []
    if not sessions:
        return breakdown

    session_ids = [s.get("id") for s in sessions]

    # Batch fetch all count lines for these sessions
    all_count_lines = await db.count_lines.find({"session_id": {"$in": session_ids}}).to_list(None)

    # Group count lines by session_id in memory
    lines_by_session = {sid: [] for sid in session_ids}
    for line in all_count_lines:
        lines_by_session[line.get("session_id")].append(line)

    # Batch fetch all items
    all_item_codes = list({line.get("item_code") for line in all_count_lines if line.get("item_code")})
    all_items = await db.erp_items.find({"item_code": {"$in": all_item_codes}}).to_list(None) if all_item_codes else []
    price_map = {
        item["item_code"]: item.get(valuation_basis, 0) or item.get("mrp", 0) for item in all_items
    }

    for session in sessions:
        session_id = session.get("id")
        count_lines = lines_by_session.get(session_id, [])

        if not count_lines:
            continue

        # Calculate metrics
        total_counted = sum(line.get("counted_qty", 0) for line in count_lines)
        total_expected = sum(line.get("erp_qty", 0) for line in count_lines)

        # Get prices
        item_codes = [line.get("item_code") for line in count_lines]
        items = [item for item in all_items if item.get("item_code") in item_codes]'''

content = re.sub(session_pattern, session_replacement, content, flags=re.MULTILINE)

# Replace _breakdown_by_date
date_pattern = r'''async def _breakdown_by_date\(db: AsyncIOMotorDatabase, valuation_basis: str\) -> List\[BreakdownItem\]:
    """Breakdown by date \(last 7 days\)"""
    breakdown = \[\]

    for days_ago in range\(7\):
        date = datetime\.now\(timezone\.utc\)\.replace\(tzinfo=None\) - timedelta\(days=days_ago\)
        start_of_day = date\.replace\(hour=0, minute=0, second=0, microsecond=0\)
        end_of_day = date\.replace\(hour=23, minute=59, second=59, microsecond=999999\)

        # Get count lines for this date
        count_lines = await db\.count_lines\.find\(
            \{"counted_at": \{"\$gte": start_of_day, "\$lte": end_of_day\}\}
        \)\.to_list\(None\)

        if not count_lines:
            continue

        # Calculate metrics \(similar pattern\)
        total_counted = sum\(line\.get\("counted_qty", 0\) for line in count_lines\)
        total_expected = sum\(line\.get\("erp_qty", 0\) for line in count_lines\)

        item_codes = \[line\.get\("item_code"\) for line in count_lines\]
        items = await db\.erp_items\.find\(\{"item_code": \{"\$in": item_codes\}\}\)\.to_list\(None\)
        price_map = \{
            item\["item_code"\]: item\.get\(valuation_basis, 0\) or item\.get\("mrp", 0\) for item in items
        \}'''

date_replacement = '''async def _breakdown_by_date(db: AsyncIOMotorDatabase, valuation_basis: str) -> List[BreakdownItem]:
    """Breakdown by date (last 7 days)"""
    breakdown = []

    dates_ranges = []
    for days_ago in range(7):
        date = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=days_ago)
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
        dates_ranges.append((days_ago, date, start_of_day, end_of_day))

    start_date = dates_ranges[-1][2]
    end_date = dates_ranges[0][3]

    all_count_lines = await db.count_lines.find(
        {"counted_at": {"$gte": start_date, "$lte": end_date}}
    ).to_list(None)

    lines_by_date = {r[0]: [] for r in dates_ranges}
    for line in all_count_lines:
        counted_at = line.get("counted_at")
        if not counted_at:
            continue
        for r in dates_ranges:
            if r[2] <= counted_at <= r[3]:
                lines_by_date[r[0]].append(line)
                break

    all_item_codes = list({line.get("item_code") for line in all_count_lines if line.get("item_code")})
    all_items = await db.erp_items.find({"item_code": {"$in": all_item_codes}}).to_list(None) if all_item_codes else []
    price_map = {
        item["item_code"]: item.get(valuation_basis, 0) or item.get("mrp", 0) for item in all_items
    }

    for r in dates_ranges:
        days_ago, date, start_of_day, end_of_day = r
        count_lines = lines_by_date.get(days_ago, [])

        if not count_lines:
            continue

        # Calculate metrics (similar pattern)
        total_counted = sum(line.get("counted_qty", 0) for line in count_lines)
        total_expected = sum(line.get("erp_qty", 0) for line in count_lines)

        # Get prices
        item_codes = [line.get("item_code") for line in count_lines]
        items = [item for item in all_items if item.get("item_code") in item_codes]'''

content = re.sub(date_pattern, date_replacement, content, flags=re.MULTILINE)

with open("backend/api/dashboard_analytics_api.py_new", "w") as f:
    f.write(content)
