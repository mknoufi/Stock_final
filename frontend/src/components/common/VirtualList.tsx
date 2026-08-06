import React, { forwardRef } from "react";
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
  ref: React.Ref<any>
) => {
  // FlashList requires estimatedItemSize for performance
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      // @ts-ignore: estimatedItemSize is missing in FlashListProps but required by library
      estimatedItemSize={estimatedItemSize}
      {...props}
      ref={ref}
    />
  );
};

export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<any> }
) => React.ReactElement;
