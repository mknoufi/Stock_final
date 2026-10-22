import re

content = ""
with open("frontend/src/components/forms/SearchAutocomplete.tsx", "r") as f:
    content = f.read()

# Replace import
content = re.sub(
    r'  FlatList,\n',
    r'',
    content
)
content = re.sub(
    r'} from "react-native";\n',
    r'} from "react-native";\nimport { VirtualList } from "../common/VirtualList";\n',
    content
)

# Replace listRef type
content = re.sub(
    r'const listRef = useRef<FlatList>\(null\);',
    r'const listRef = useRef<any>(null);',
    content
)

# Replace FlatList component usage
content = re.sub(
    r'              <FlatList\n                ref={listRef}\n                data={results}\n                renderItem={renderResultItem}\n                keyExtractor={\(item, index\) => `\$\{item.item_code\}-\$\{index\}`}\n                style={styles.resultsList}\n                keyboardShouldPersistTaps="handled"\n                maxToRenderPerBatch={10}\n                windowSize={5}\n                showsVerticalScrollIndicator={true}\n              />',
    r'              {/* ⚡ Bolt: Replaced FlatList with VirtualList (FlashList) to improve scrolling performance, handle potentially long paginated search results without lag, and reduce frame drops. */}\n              <VirtualList\n                ref={listRef}\n                data={results}\n                renderItem={renderResultItem}\n                estimatedItemSize={70}\n                keyExtractor={(item, index) => `${item.item_code}-${index}`}\n                style={styles.resultsList}\n                keyboardShouldPersistTaps="handled"\n                showsVerticalScrollIndicator={true}\n              />',
    content
)

with open("frontend/src/components/forms/SearchAutocomplete.tsx", "w") as f:
    f.write(content)
