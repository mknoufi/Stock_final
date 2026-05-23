## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2024-05-23 - Resolve N+1 query in bulk_export_sessions
**Learning:** Iterating per item for bulk operations causes significant N+1 DB roundtrip bottlenecks. Mapping results from an `$in` query preserves order while ensuring O(1) DB calls.
**Action:** When implementing bulk read operations, always use `$in` queries mapped to dictionaries to fetch related data in a single roundtrip.
