
## 2025-02-19 - Replace FlatList with VirtualList for Performance
**Learning:** Found a common pattern in the React Native codebase where standard `FlatList` components cause rendering bottlenecks in large autocomplete or dropdown lists. `VirtualList`, which wraps `@shopify/flash-list`, is available as a robust alternative.
**Action:** Default to `VirtualList` with an accurate `estimatedItemSize` property when rendering moderately to highly populated lists (e.g. dropdowns, activity feeds) to avoid frame drops. When doing this, ensure types such as `FlashList` are correctly imported and mapped for `useRef` to maintain TypeScript strictness. Avoid running `npm install` just for format/lint checks because lockfile issues are prevalent in restricted environments.
