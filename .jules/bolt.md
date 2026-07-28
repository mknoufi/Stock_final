## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2026-07-28 - Optimize Idempotency Checks in Sync Batch API
**Learning:** Found an N+1 query problem where `db.idempotency_operations.find_one` was called in a loop inside batch processing endpoints (`sync_batch` and `_process_legacy_operations`).
**Action:** Replaced sequential queries with a single bulk query using the `$in` operator, caching the results in a set to achieve O(1) memory lookups. This scales better when syncing large payloads.
