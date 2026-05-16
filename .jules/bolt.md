
## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2025-02-23 - N+1 Query in Sync Batch Validations
**Learning:** In backend operations (like sync_batch or legacy sync), checking idempotency for an entire batch inside a loop results in an N+1 MongoDB query pattern that slows down batch sync performance.
**Action:** Pre-fetch idempotency keys via a single `$in` query mapping `operation_id` to a set, enabling O(1) checks during the loop and reducing latency by consolidating database lookups.
