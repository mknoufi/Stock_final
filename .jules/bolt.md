## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2025-02-18 - mongomock unsupported aggregation fallbacks
**Learning:** `mongomock` does not support many advanced MongoDB aggregation operators. We must be careful replacing simple fetches with full aggregation pipelines in order not to break test compatibility.
**Action:** Use explicit field projection and safety checks on `$in` clauses (like `if list else []`) coupled with optimized Python list comprehensions / aggregations when dealing with large datasets queried via Motor.
