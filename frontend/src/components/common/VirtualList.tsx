import React from "react";
import { FlatListProps } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

interface VirtualListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  renderItem: ListRenderItem<T>;
  estimatedItemSize: number;
}

/**
 * Virtualized List Component
 * Uses Shopify FlashList for high performance with large datasets.
 * Fallback to FlatList if needed, but FlashList is recommended for React Native.
 */
const VirtualListInner = <T,>(
  { data, renderItem, estimatedItemSize, ...props }: VirtualListProps<T>,
  ref: React.Ref<FlashList<T>>
) => {
  return (
    <FlashList
      ref={ref}
      data={data}
      renderItem={renderItem}
      // @ts-ignore
      estimatedItemSize={estimatedItemSize}
      {...props}
    />
  );
};

// eslint-disable-next-line react/display-name
export const VirtualList = React.forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<FlashList<T>> }
) => React.ReactElement;
