## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2024-05-18 - Deduplicate `$in` array arguments in Motor queries
**Learning:** Using list comprehensions to collect keys for MongoDB `$in` queries inside loops can unintentionally build massive arrays containing thousands of duplicate values (e.g., `item_codes`). This forces Motor and MongoDB to serialize, transmit, and process unnecessarily large payloads, leading to performance degradation and higher memory overhead.
**Action:** Always wrap the sequence in a `set()` (e.g., `list(set(item_codes))`) before passing it to the `$in` operator to guarantee uniqueness and minimize the query payload size.
