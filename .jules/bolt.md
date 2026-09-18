## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2025-03-08 - Use VirtualList for all large lists
**Learning:** Found an instance in `SearchAutocomplete.tsx` where standard `FlatList` was used to render autocomplete dropdown suggestions, causing potential scrolling performance and lag for large returned data subsets. In React Native apps, list performance is highly dependent on virtualization (using FlashList underneath).
**Action:** Always verify custom wrapper components like `VirtualList` are used for rendering long datasets instead of the native React `FlatList`. Ensure to supply `estimatedItemSize` accurately.
