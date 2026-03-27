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
// eslint-disable-next-line react/display-name
export const VirtualList = forwardRef<any, VirtualListProps<any>>(
  (
    {
      data,
      renderItem,
      estimatedItemSize,
      ...props
    },
    ref
  ) => {
    // FlashList requires estimatedItemSize for performance
    return (
      <FlashList
        ref={ref}
        data={data}
        renderItem={renderItem}
        // @ts-ignore: estimatedItemSize is missing in FlashListProps but required by library
        estimatedItemSize={estimatedItemSize}
        {...props}
      />
    );
  }
);
