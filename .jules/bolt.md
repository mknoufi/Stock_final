## 2024-03-24 - Bulk Queries over O(N) operations

**Learning:** When performing operations on multiple records, looping over individual queries inside loops like `for record in request.records: await db.collection.find_one({"operation_id": record.id})` introduces severe N+1 latency, leading to performance bottlenecks when handling batch uploads or operations in synchronous APIs.
**Action:** Replace single queries inside loops with a bulk `$in` query beforehand to retrieve all necessary records simultaneously, storing the results in a set (or dict mapped by key) for O(1) in-memory lookups.
