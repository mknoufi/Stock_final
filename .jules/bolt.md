## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2026-05-24 - [N+1 DB Query Optimization in Backend APIs]
**Learning:** Iterating over MongoDB records and performing a database query inside the loop results in severe N+1 performance bottlenecks.
**Action:** Use bulk fetches mapping parent IDs using the '$in' operator (e.g., db.collection.find({'parent_id': {'$in': parent_ids}})) and load the relationships into an in-memory dictionary grouped by ID for O(1) resolution.
