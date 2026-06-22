## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2026-06-22 - [N+1 vs Bulk Operations in MongoDB]
**Learning:** Iterating through user ids and updating or fetching MongoDB documents individually can create severe N+1 bottlenecks. Modifying `bulk_user_action` endpoints to leverage single bulk query methods (`update_many`, `delete_many`) is vastly faster.
**Action:** Use an O(1) bulk interaction pattern with `$in` rather than iterating inside API loops for bulk entity management.
