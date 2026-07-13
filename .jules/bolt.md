## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2026-07-13 - [Concurrent MongoDB queries via asyncio.gather]
**Learning:** In backend endpoints like the Security Dashboard, making multiple sequential independent MongoDB queries (e.g., aggregation counts, finds) creates an unnecessary I/O bottleneck resulting in high latency, as each await pauses execution until the query completes.
**Action:** Use `asyncio.gather()` in Python backend modules to execute independent MongoDB operations concurrently (especially for statistics or summary endpoints), drastically reducing database round-trip time.
