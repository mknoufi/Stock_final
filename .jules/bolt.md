## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2026-05-12 - Optimization of Report Generation
**Learning:** In generate_variance_report, pulling the entire erp_items collection to filter item dictionaries before retrieving count lines causes O(N) memory overhead. This is especially risky for variance reports where count lines constitute a very small subset of total items.
**Action:** Use an $in query scoped to the extracted item_codes from count lines before resolving item context.
