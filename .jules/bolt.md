## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2026-03-15 - N+1 query loop optimizations via $in and update_many
**Learning:** When migrating from N+1 iterations to `$in` queries, using in-memory dictionaries or sets for deduplication is crucial. Deduplicate and process arrays properly to minimize serialization.
**Action:** Always fetch records in bulk for processing pipelines instead of iterative individual lookups, and use `update_many` for bulk operations.
