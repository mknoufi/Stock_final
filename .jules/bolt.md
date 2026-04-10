## 2024-06-25 - [MongoDB Aggregate replacing Python memory mapping]
**Learning:** O(N) object mapping and operations within python using MongoDB datasets can become a major chokepoint as `find({})` pulls all data over the network and serializes it in python memory.
**Action:** When performing global calculations, push the logic into the database via an aggregation `$group` pipeline, and limit python `$in` mappings only to strictly required subsets.
