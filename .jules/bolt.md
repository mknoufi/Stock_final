## 2024-05-24 - Batch Data Fetching in Dashboard Analytics
**Learning:** In highly nested dashboard aggregation endpoints (like `_breakdown_by_session`), querying the database inside the loop (N+1 query problem) drastically slows down the API, especially when the database connection adds a few milliseconds of network latency per query.
**Action:** Always batch fetch dependencies outside the loop using `$in` operators with deduplicated keys (`set()` to remove duplicates before calling DB) and create an intermediate in-memory dictionary mapping for `O(1)` retrieval inside the loop.
