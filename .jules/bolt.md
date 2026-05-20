## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2024-06-03 - [Optimized Autocomplete Search and Long Lists]
**Learning:** Virtualization is critically needed across common UX patterns like autocomplete dropdowns and select modals, as standard `FlatList` significantly slows down interaction.
**Action:** Always replace `FlatList` with `VirtualList` in Select Modals and Autocomplete Components where lists can easily exceed 20 items.
