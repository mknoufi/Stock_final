## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2024-06-18 - Deduplicating Item Codes for Aggregations
**Learning:** Using `$in` array filters with thousands of duplicate values across aggregation lists degrades performance.
**Action:** When filtering with large lists in MongoDB (e.g. `{"item_code": {"$in": item_codes}}`), use `list(set(...))` to ensure deduplication. This minimizes the payload overhead and improves backend aggregation and query runtime significantly.
