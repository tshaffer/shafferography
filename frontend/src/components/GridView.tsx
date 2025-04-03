import * as React from 'react';
import { VariableSizeList } from 'react-window';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FilteredMediaItemPicker, GridRowData, MediaItem } from '../types';
import { setScrollPositionRedux, TedTaggerDispatch } from '../models';
import { getAppInitialized, getFilteredMediaItems, getNumGridColumns, getScrollPosition } from '../selectors';
import { getGridRowHeight } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';
import throttle from 'lodash/throttle';

export interface GridViewProps {
  appInitialized: boolean;
  numGridColumns: number;
  allMediaItems: FilteredMediaItemPicker[];
  savedScrollOffset: number;
  onSaveScrollOffset: (offset: number) => void;
}

const GridView = ({ setTooltip, ...props }: GridViewProps & {
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void
}) => {

  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);
  const listRef = React.useRef<VariableSizeList>(null);

  React.useEffect(() => {
    console.log("GridView mounted");
    console.log(props.savedScrollOffset);
    console.log(listRef.current);
    if (listRef.current) {
      const scrollOffset = props.savedScrollOffset;
      setTimeout(() => {
        console.log('scrollTo', listRef.current);
        listRef.current!.scrollTo(scrollOffset);
      }, 100);
    }
    return () => {
      console.log("GridView unmounted");
    };
  }, []);

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

  const getGridRowData = (): GridRowData[] => {
    if (gridWidth === 0) return [];

    const targetHeight = targetHeights[props.numGridColumns - 2];
    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;

    while (mediaItemIndex <= props.allMediaItems.length - 1) {
      const gridRowData: GridRowData = getGridRowHeight(
        gridWidth,
        targetHeight,
        props.allMediaItems as MediaItem[],
        mediaItemIndex,
        props.allMediaItems.length - 1
      );
      mediaItemIndex += gridRowData.numMediaItems;
      gridRows.push(gridRowData);
    }
    return gridRows;
  };

  if (!props.appInitialized || props.allMediaItems.length === 0) {
    return null;
  }

  const gridRows = React.useMemo(() => getGridRowData(), [
    gridWidth,
    props.numGridColumns,
    props.allMediaItems,
  ]);

  const rowHeights = React.useMemo(() => gridRows.map(row => row.rowHeight), [gridRows]);

  const renderRow = React.useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const rowData = gridRows[index];
      return (
        <div style={{ ...style, height: rowData.rowHeight }}>
          <GridRow
            key={rowData.mediaItemIndex}
            mediaItemIndex={rowData.mediaItemIndex}
            numMediaItems={rowData.numMediaItems}
            rowHeight={rowData.rowHeight}
            cellWidths={rowData.cellWidths}
            setTooltip={setTooltip} // Pass setTooltip down to GridRow
          />
        </div>
      );
    },
    [gridRows, setTooltip]
  );

  // Create a throttled version of onSaveScrollOffset so it fires at most once every 200ms
  const throttledOnSaveScrollOffset = React.useMemo(() => throttle((offset: number) => {
    props.onSaveScrollOffset(offset);
  }, 200), [props.onSaveScrollOffset]);

  // Cancel the throttled function on unmount
  React.useEffect(() => {
    return () => {
      throttledOnSaveScrollOffset.cancel();
    };
  }, [throttledOnSaveScrollOffset]);

  const handleScroll = ({
    scrollOffset,
    scrollDirection,
    scrollUpdateWasRequested,
  }: {
    scrollOffset: number;
    scrollDirection: string;
    scrollUpdateWasRequested: boolean;
  }) => {
    throttledOnSaveScrollOffset(scrollOffset);
  };

  const getItemSize = (index: number) => rowHeights[index];
  const listHeight = window.innerHeight - 112;

  console.log('GridView:', props.savedScrollOffset);

  return (
    <div ref={gridContainerRef} style={{ width: '100%', overflow: 'hidden' }} id='variableSizeListContainer'>
      <VariableSizeList
        ref={listRef}
        onScroll={handleScroll}
        itemSize={getItemSize}
        height={listHeight}
        itemCount={gridRows.length}
        width="100%"
      >
        {renderRow}
      </VariableSizeList>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    numGridColumns: getNumGridColumns(state),
    allMediaItems: getFilteredMediaItems(state),
    savedScrollOffset: getScrollPosition(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSaveScrollOffset: setScrollPositionRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
