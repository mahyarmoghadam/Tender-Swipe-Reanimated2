import { Block } from "expo-ui-kit";
import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  NativeScrollSize,
  NativeScrollPoint,
  Text,
  ViewStyle,
} from "react-native";

export interface MasonryListProps<T> {
  data: Array<T>;
  numColumns: number;
  renderItem: ({
    item,
    index,
    column: number,
  }: {
    item: T;
    index: number;
    column: number;
  }) => React.ReactElement<any>;
  getHeightForItem: ({ item, index }: { item: T; index: number }) => number;
  ListHeaderComponent?: () => React.ReactElement<any> | null;
  ListFooterComponent?: () => React.ReactElement<any> | null;
  ListEmptyComponent?: () => React.ReactElement<any> | null;
  /**
   * Used to extract a unique key for a given item at the specified index. Key is used for caching
   * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
   * falls back to using the index, like React does.
   */
  keyExtractor?: (item: T, index: number) => string;
  // onEndReached will get called once per column, not ideal but should not cause
  // issues with isLoading checks.
  onEndReached?: () => void;
  contentContainerStyle?: ViewStyle;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollBeginDrag?: (event: Object) => void;
  onScrollEndDrag?: (event: Object) => void;
  onMomentumScrollEnd?: (event: Object) => void;
  onEndReachedThreshold?: number;
  scrollEventThrottle?: number;
  isLoading: boolean;
  /**
   * Set this true while waiting for new data from a refresh.
   */
  refreshing?: boolean;
  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make
   * sure to also set the `refreshing` prop correctly.
   */
  onRefresh?: () => void;
}

export interface Column<T> {
  index: number;
  totalHeight: number;
  data: Array<T>;
  heights: Array<number>;
}

export interface ColumnsProps<T> {
  numColumns: number;
  data: T[];
  getHeightForItem: ({ item, index }: { item: T; index: number }) => number;
}

const createColumns = <T extends {}>({
  numColumns,
  data,
  getHeightForItem,
}: ColumnsProps<T>) => {
  const columns: Array<Column<T>> = Array.from({
    length: numColumns,
  }).map((col, i) => ({
    index: i,
    totalHeight: 0,
    data: [],
    heights: [],
  }));

  data.forEach((item: T, index: number) => {
    const height = getHeightForItem({ item, index });
    const column = columns.reduce(
      (prev, cur) => (cur.totalHeight < prev.totalHeight ? cur : prev),
      columns[0]
    );
    column.data.push(item);
    column.heights.push(height);
    column.totalHeight += height;
  });

  return { columns };
};

export default function MasonryList<T>({
  data,
  numColumns = 1,
  renderItem,
  getHeightForItem,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  onEndReached,
  contentContainerStyle,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollEnd,
  scrollEventThrottle = 1,
  isLoading,
  refreshing,
  onRefresh,
}: MasonryListProps<T>) {
  var { columns } = createColumns({ numColumns, data, getHeightForItem });

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: NativeScrollSize;
    contentOffset: NativeScrollPoint;
    contentSize: NativeScrollSize;
  }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  if (data.length <= 0 && ListEmptyComponent != undefined) {
    return ListEmptyComponent();
  }

  return (
    <ScrollView
      onScroll={(event) => {
        if (isCloseToBottom(event.nativeEvent)) {
          onEndReached && onEndReached();
        }
        onScroll && onScroll(event);
      }}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      scrollEventThrottle={scrollEventThrottle}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      {ListHeaderComponent && ListHeaderComponent()}
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {columns.map((col) => (
          <Block key={col.index}>
            {col.data.map((item, index) => (
              <Block noflex key={index}>
                {renderItem({ item, index, column: col.index })}
              </Block>
            ))}
          </Block>
        ))}
      </View>
      {ListFooterComponent && ListFooterComponent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
});
