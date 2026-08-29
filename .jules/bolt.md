## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.
## 2024-08-29 - N+1 Query in Bulk Synchronization
**Learning:** Checking idempotency individually per record within an operations loop using `find_one` causes an N+1 database problem.
**Action:** When handling batch records (such as bulk synchronization operations), pre-fetch necessary metadata by querying with `$in` to extract a single set in memory and map records to avoid repeating db queries within iterations.
