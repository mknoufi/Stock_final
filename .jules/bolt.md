
## 2024-05-18 - [N+1 Query in Breakdown Analytics]
**Learning:** Found N+1 query patterns inside analytics breakdown endpoints where `find({"item_code": {"$in": item_codes}}).to_list(None)` is executed iteratively inside a `for` loop over groups (locations, categories, sessions, dates). This multiplies database latency linearly with the number of groups, creating a severe performance bottleneck.
**Action:** Always batch gather all IDs (`item_codes`) from all groups first, execute a single `find({"item_code": {"$in": all_item_codes}}).to_list(None)`, and build a dictionary map. Use the dictionary for fast O(1) lookups during the breakdown calculation loop instead of issuing repeated queries.
