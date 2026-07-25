import re

with open("frontend/src/components/common/VirtualList.tsx", "r") as f:
    content = f.read()

# Make VirtualList forwardRef
old_export = """export function VirtualList<T>({
  data,
  renderItem,
  estimatedItemSize,
  ...props
}: VirtualListProps<T>) {"""

new_export = """export const VirtualList = React.forwardRef(function VirtualList<T>(
  {
    data,
    renderItem,
    estimatedItemSize,
    ...props
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<any>
) {"""

content = content.replace(old_export, new_export)

old_return = """  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      // @ts-ignore: estimatedItemSize is missing in FlashListProps but required by library
      estimatedItemSize={estimatedItemSize}
      {...props}
    />
  );
}"""

new_return = """  return (
    <FlashList
      ref={ref}
      data={data}
      renderItem={renderItem}
      // @ts-ignore: estimatedItemSize is missing in FlashListProps but required by library
      estimatedItemSize={estimatedItemSize}
      {...props}
    />
  );
});"""

content = content.replace(old_return, new_return)

with open("frontend/src/components/common/VirtualList.tsx", "w") as f:
    f.write(content)

print("Updated VirtualList.tsx")
