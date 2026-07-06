## 2024-05-24 - [List Rendering Optimization in React Native]
**Learning:** React Native's standard `FlatList` can suffer significant frame drops and memory issues when rendering long, complex items or paginated lists with infinite scrolling (like search results). The `VirtualList` component (which wraps `@shopify/flash-list`) is vastly superior for these use cases but requires a precisely calculated `estimatedItemSize` to function optimally.
**Action:** When working with potentially long lists in this codebase (especially in search or data tables), always prefer `VirtualList` over `FlatList`. Ensure you calculate an accurate `estimatedItemSize` by inspecting the item's layout and styles (padding, margins, font sizes) rather than guessing.

## 2024-07-06 - [Backend Optimization: Fix N+1 queries in loops]
**Learning:** Found loops executing `await db.collection.count_documents()` inside endpoints returning multiple items (e.g. `rack_api.py`). This creates an N+1 query problem, severely impacting performance as `N` grows due to consecutive network round-trips.
**Action:** When gathering associated counts or data for a list of items, avoid querying inside a loop. Instead, extract the required identifiers, run a single `$match` and `$group` aggregation pipeline across all items, and build a Python dictionary mapping the results back to each original item in O(1) time.
