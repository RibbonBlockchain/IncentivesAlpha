import React from "react";
import { Table, Column, WindowScroller, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { TableWrapper } from "../../theme";

function VirtualizedTable(props) {
  return (
    <TableWrapper>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <Table
                autoHeight
                width={width}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                {...props}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </TableWrapper>
  );
}

export { Column, VirtualizedTable };
