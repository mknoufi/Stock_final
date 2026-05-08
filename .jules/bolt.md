## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2024-05-24 - [N+1 Query in Bulk Endpoints]
**Learning:** Found multiple instances of N+1 query patterns in bulk session endpoints where items were retrieved iteratively via `find_one()` instead of using a single `$in` query. The `bulk_export_sessions` endpoint was one such bottleneck.
**Action:** Always replace iterative database queries in bulk operations with optimized array queries like `$in` to drastically reduce latency and I/O overhead.
