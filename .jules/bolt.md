## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2025-05-09 - [Backend MongoDB N+1 Prevention]
**Learning:** Iterative database lookups (e.g. `find_one` inside loops over session tokens) cause significant N+1 performance bottlenecks.
**Action:** Replaced iterative queries with single bulk queries using MongoDB's `$in` operator to map entities for O(1) in-memory lookup.
