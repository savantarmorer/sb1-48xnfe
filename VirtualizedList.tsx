import React from 'react';
import { FixedSizeList } from 'react-window';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  className = ''
}: VirtualizedListProps<T>) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const height = isMobile ? 400 : 600;

  return (
    <FixedSizeList
      height={height}
      width="100%"
      itemCount={items.length}
      itemSize={itemHeight}
      className={`scrollbar-hidden ${className}`}
    >
      {({ index, style }) => (
        <div style={style}>
          {renderItem(items[index], index)}
        </div>
      )}
    </FixedSizeList>
  );
}