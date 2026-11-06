
## 2026-11-06 - Dashboard memory optimization
**Learning:** Returning all fields from `db.erp_items.find({})` can lead to huge memory overhead when only fields like `item_code`, `stock_qty`, and pricing fields are needed for aggregation. Also, using `$in` query with dynamically constructed `item_codes` might pass an empty list which fails or returns unexpected results if not handled safely.
**Action:** Use MongoDB projections in `find()` calls to restrict returned fields to what's strictly necessary. Apply safety checks like `... if item_codes else []` when executing `$in` queries against dynamic arrays.
