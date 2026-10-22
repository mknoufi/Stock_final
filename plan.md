1. **Explore `frontend/src/components/forms/SearchAutocomplete.tsx` for `FlatList` replacement**:
   - I'll replace `FlatList` with `VirtualList` (which wraps `@shopify/flash-list`) to optimize rendering of potentially long search results.
   - Modify import statements: Add `import { VirtualList } from "../common/VirtualList";` and remove `FlatList`.
   - Update `listRef` to use `any` type or `typeof VirtualList` instead of `FlatList` to satisfy TS types.
   - Replace `<FlatList ... />` component instance with `<VirtualList ... />` in JSX, and include `estimatedItemSize={70}` based on the layout styling height (~70px including paddings and texts). Remove `FlatList` specific props such as `maxToRenderPerBatch` and `windowSize`.
   - Add Bolt optimization comment above the `<VirtualList>` component.

2. **Verify changes using explicit commands**:
   - Use `grep -B 5 -A 10 "VirtualList" frontend/src/components/forms/SearchAutocomplete.tsx` to verify `VirtualList` replaced `FlatList`.
   - Ensure linter passes using `npm run lint` or local execution equivalent.

3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done**:
   - Run tests `cd frontend && npm run test` to verify changes didn't break things.
   - Address any specific failures from pre-commit instructions, like checking syntax with `tsc`.

4. **Submit with proper Bolt messaging**:
   - Create submission with required fields `💡 What:`, `🎯 Why:`, `📊 Impact:`, and `🔬 Measurement:` in the description.
