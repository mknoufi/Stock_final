with open("frontend/src/components/forms/SearchAutocomplete.tsx", "r") as f:
    content = f.read()

# Fix the renderItem type and ref
content = content.replace(
    '// @ts-ignore: VirtualList wrapper type limitation with ref',
    ''
)
content = content.replace(
    'renderItem={renderResultItem as any} // Cast due to type slight mismatch with ListRenderItem',
    'renderItem={renderResultItem as any}'
)

with open("frontend/src/components/forms/SearchAutocomplete.tsx", "w") as f:
    f.write(content)

print("Fixed SearchAutocomplete.tsx")
