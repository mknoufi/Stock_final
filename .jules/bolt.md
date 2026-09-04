## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2024-05-24 - [Python Set Comprehensions]
**Learning:** Using `set(x for y in z)` creates an intermediate generator object before passing it to `set()`, which is slower and consumes more memory than using a direct set comprehension `{x for y in z}`.
**Action:** Always prefer set comprehensions over casting generators to sets when creating sets from iterables, especially in performance-sensitive areas like dashboard analytics loops.
