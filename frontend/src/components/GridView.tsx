import { VariableSizeList as List } from 'react-window';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GridRowData, MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getMediaItems, getNumGridColumns, getScrollPosition } from '../selectors';
import { getGridRowHeight } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';
import GlobalTooltip from './GlobalTooltip';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[];
  numGridColumns: number;
  scrollPosition: number;
}

const GridView = (props: GridViewProps) => {
  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<List>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);
  const [gridRows, setGridRows] = React.useState<GridRowData[]>([]);
  const [tooltip, setTooltip] = React.useState<{ text: string; position: { top: number; left: number } } | null>(null);

  const getGridRowData = (): GridRowData[] => {
    if (gridWidth === 0) return [];

        const targetHeight = targetHeights[props.numGridColumns - 2];
    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;

    while (mediaItemIndex < props.allMediaItems.length) {
      const gridRowData: GridRowData = getGridRowHeight(
        gridWidth,
        targetHeight,
        props.allMediaItems,
        mediaItemIndex,
        props.allMediaItems.length
      );
      mediaItemIndex += gridRowData.numMediaItems;
      gridRows.push(gridRowData);
    }
    return gridRows;
  };

  React.useEffect(() => {
    const updateGridWidth = () => {
      if (gridContainerRef.current) {
        setGridWidth(gridContainerRef.current.clientWidth);
      }
    };

    updateGridWidth();
    window.addEventListener('resize', updateGridWidth);
    return () => window.removeEventListener('resize', updateGridWidth);
  }, []);

  React.useEffect(() => {
    if (gridWidth > 0) {
      const rows = getGridRowData();
      setGridRows(rows);
      console.log(rows);
    }
  }, [gridWidth, props.numGridColumns, props.allMediaItems]);

  const getRowHeight = (index: number) => gridRows[index]?.rowHeight || 100;

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rowData = gridRows[index];
    return (
      <div style={{ ...style, height: rowData.rowHeight }}>
        <GridRow
          mediaItemIndex={rowData.mediaItemIndex}
          numMediaItems={rowData.numMediaItems}
          rowHeight={rowData.rowHeight}
          cellWidths={rowData.cellWidths}
          setTooltip={setTooltip} // Pass tooltip handler to GridRow
          />
      </div>
    );
  };

  if (!props.appInitialized || props.allMediaItems.length === 0) {
    return null;
  }

  return (
    <div ref={gridContainerRef} style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      <List
        ref={listRef}
        height={window.innerHeight}
        itemCount={gridRows.length}
        itemSize={getRowHeight} // Use function for dynamic row heights
        width="100%"
      >
        {renderRow}
      </List>
      {/* <GlobalTooltip tooltip={tooltip} /> */}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    numGridColumns: getNumGridColumns(state),
    scrollPosition: getScrollPosition(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
