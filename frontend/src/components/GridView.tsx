import * as React from 'react';
import { VariableSizeList } from 'react-window';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FilteredMediaItemPicker, GridRowData, MediaItem } from '../types';
import { setScrollPositionRedux, TedTaggerDispatch } from '../models';
import { getAppInitialized, getDisplayMetadata, getFilteredMediaItems, getNumGridColumns, getRightPanelOpen, getScrollPosition, getSidebarOpen } from '../selectors';
import { getGridRowInfo } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';
import throttle from 'lodash/throttle';

export interface GridViewProps {
  appInitialized: boolean;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  numGridColumns: number;
  allMediaItems: FilteredMediaItemPicker[];
  displayMetadata: boolean;
  savedScrollOffset: number;
  onSaveScrollOffset: (offset: number) => void;
}

const GridView = ({ setTooltip, ...props }: GridViewProps & {
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void
}) => {

  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);
  const listRef = React.useRef<VariableSizeList>(null);

  const prevProps = React.useRef<any>(null);

  React.useEffect(() => {

    // console.log('GridView useEffect');
    // console.log('prevProps:', prevProps.current);
    // console.log('currentProps:', props);

    if (prevProps.current) {
      if (prevProps.current.displayMetadata !== props.displayMetadata) {
        // console.log('Display metadata changed:', props.displayMetadata);
        if (listRef.current) {
          listRef.current.resetAfterIndex(0, true);
        }
      }

      //   // const changedProps: Partial<any> = {};

      //   // if (prevProps.current.appInitialized !== props.appInitialized) {
      //   //   changedProps.appInitialized = props.appInitialized;
      //   // }
      //   // if (prevProps.current.photoLayout !== props.photoLayout) {
      //   //   changedProps.photoLayout = props.photoLayout;
      //   // }
      //   // if (prevProps.current.allMediaItems !== props.allMediaItems) {
      //   //   changedProps.allMediaItems = props.allMediaItems;
      //   // }

      //   // if (Object.keys(changedProps).length > 0) {
      //   //   console.log("PhotosContainer: rerender due to changes in:", changedProps);
      //   // }
    }
    prevProps.current = props;
  }, [props]);

  React.useEffect(() => {
    // console.log("GridView mounted");
    if (listRef.current) {
      const scrollOffset = props.savedScrollOffset;
      setTimeout(() => {
        listRef.current!.scrollTo(scrollOffset);
      }, 100);
    }
  }, []);

  React.useEffect(() => {
    const updateGridWidth = () => {
      if (gridContainerRef.current) {
        setGridWidth(gridContainerRef.current.clientWidth - 18); // Adjust for scrollbar width
      }
    };

    updateGridWidth();
    window.addEventListener('resize', updateGridWidth);
    return () => window.removeEventListener('resize', updateGridWidth);
  }, []);

  React.useEffect(() => {

    console.log('GridView useEffect observer invoked');

    if (!gridContainerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const width = target.clientWidth;
        console.log('ResizeObserver clientWidth:', width);
        setGridWidth(width - 18); // Adjust for scrollbar width
      }
    });

    observer.observe(gridContainerRef.current);

    return () => observer.disconnect();
  }, []);

  const getGridRowData = (): GridRowData[] => {
    if (gridWidth === 0) return [];

    console.log('getGridRowData gridWidth:', gridWidth);

    const targetHeight = targetHeights[props.numGridColumns - 2];
    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;

    while (mediaItemIndex <= props.allMediaItems.length - 1) {
      const gridRowData: GridRowData = getGridRowInfo(
        gridWidth,
        targetHeight,
        props.allMediaItems as MediaItem[],
        mediaItemIndex,
        props.allMediaItems.length - 1
      );
      const sum = gridRowData.cellWidths.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      console.log('getGridRowData row width:', sum);

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
    [gridRows, setTooltip, props.displayMetadata]
  );

  // Create a throttled version of onSaveScrollOffset so it fires at most once every 200ms
  const throttledOnSaveScrollOffset = React.useMemo(() => throttle((offset: number) => {
    // console.log('Throttled scroll offset:', offset);
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

  const getItemSize = (index: number) => {
    // console.log('getItemSize :', rowHeights[index] + (props.displayMetadata ? 60 : 0));
    return rowHeights[index] + (props.displayMetadata ? 60 : 0);
  };
  // const getItemSize = (index: number) => rowHeights[index];
  const listHeight = window.innerHeight - 112;

  // console.log('rowHeight:', rowHeights);

  console.log('GridView render');

  return (
    <div ref={gridContainerRef} style={{ width: '100%', overflow: 'hidden' }} id='variableSizeListContainer'>
      <VariableSizeList
        ref={listRef}
        onScroll={handleScroll}
        itemSize={getItemSize}
        height={listHeight}
        itemCount={gridRows.length}
        width="100%"
        overscanCount={1}
        onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
          // console.log('react-window visible start, end indices:', visibleStartIndex, visibleStopIndex);
        }}
      >
        {renderRow}
      </VariableSizeList>
    </div>
  );
};

function mapStateToProps(state: any) {
  // console.log('mapStateToProps: displayMetadata:', getDisplayMetadata(state));

  return {
    sidebarOpen: getSidebarOpen(state),
    rightPanelOpen: getRightPanelOpen(state),
    appInitialized: getAppInitialized(state),
    numGridColumns: getNumGridColumns(state),
    allMediaItems: getFilteredMediaItems(state),
    savedScrollOffset: getScrollPosition(state),
    displayMetadata: getDisplayMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSaveScrollOffset: setScrollPositionRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
