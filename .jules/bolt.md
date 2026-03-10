## 2024-11-20 - Package-Lock Churn During Frontend Testing
**Learning:** Running `npm install` in the frontend to satisfy testing dependencies can inadvertently cause `package-lock.json` churn (like `"peer": true` flag changes) due to NPM version mismatches between the current agent environment and the original repo setup.
**Action:** Always run `git checkout -- frontend/package-lock.json` after running `npm install` and before committing, unless instructed to update dependencies, to avoid polluting PRs with unrequested lockfile noise.

## 2024-11-20 - Type Inference Loss in Render Props
**Learning:** When refactoring a component like `FlatList` to `VirtualList`, explicitly adding `(item: any)` to callbacks like `keyExtractor` overrides TypeScript's ability to infer types from the generic array passed to `data`, which degrades type safety and triggers linter/reviewer objections.
**Action:** Trust TypeScript to infer the parameter type (e.g., `(item) => ...`) from the generic context whenever possible, avoiding `any`.
