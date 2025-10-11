import * as React from 'react';
import { VariableSizeList } from 'react-window';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FilteredMediaItemPicker, GridRowData, MediaItem, PhotoState } from '../types';
import { setScrollPositionRedux, TedTaggerDispatch } from '../models';
import { getAppInitialized, getDisplayMetadata, getFilteredMediaItems, getNumGridColumns, getRightPanelOpen, getScrollPosition, getSelectedMediaItemIds, getSidebarOpen } from '../selectors';
import { getGridRowInfo } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';
import throttle from 'lodash/throttle';
import { loadAndReplaceMediaItemsByViewSpec, setPhotoState } from '../controllers';

export interface GridViewProps {
  appInitialized: boolean;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  numGridColumns: number;
  allMediaItems: FilteredMediaItemPicker[];
  selectedMediaItemIds: string[];
  displayMetadata: boolean;
  savedScrollOffset: number;
  dimensionsSignature: string;
  onSaveScrollOffset: (offset: number) => void;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onReloadMediaItemsByViewSpec: () => any;
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

    // console.log('GridView useEffect observer invoked');

    if (!gridContainerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const width = target.clientWidth;
        // console.log('ResizeObserver clientWidth:', width);
        setGridWidth(width - 18); // Adjust for scrollbar width
      }
    });

    observer.observe(gridContainerRef.current);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {

    // console.log('GridView: eventList React.useEffect - invoked');

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Delete':
          handleDeletePhoto();
          break;
        default:
          break;
      }
    };

    const handleDeletePhoto = () => {
      props.onSetPhotoState(props.selectedMediaItemIds, PhotoState.Deleted)
        .then(() => {
          props.onReloadMediaItemsByViewSpec()
            .then(() => { });
        });
    }


    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [props.selectedMediaItemIds]);


  const getGridRowData = (): GridRowData[] => {

    if (gridWidth === 0) return [];

    const targetHeight = targetHeights[props.numGridColumns - 2];
    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;

    let runningMaxRowHeight = targetHeight;

    while (mediaItemIndex <= props.allMediaItems.length - 1) {
      const gridRowData: GridRowData = getGridRowInfo(
        gridWidth,
        targetHeight,
        runningMaxRowHeight,
        props.allMediaItems as MediaItem[],
        mediaItemIndex,
        props.allMediaItems.length - 1
      );
      // const sum = gridRowData.cellWidths.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      // console.log('getGridRowData row width:', sum);

      if (gridRowData.rowHeight > runningMaxRowHeight) {
        runningMaxRowHeight = gridRowData.rowHeight;
      }

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
    props.dimensionsSignature,
  ]);

  const rowHeights = React.useMemo(() => gridRows.map(row => row.rowHeight), [gridRows]);

  // When row heights change, tell react-window to throw away size cache
  const prevRowHeightsRef = React.useRef<number[]>([]);
  React.useEffect(() => {
    const prev = prevRowHeightsRef.current;
    const changed =
      prev.length !== rowHeights.length ||
      prev.some((h, i) => h !== rowHeights[i]);

    if (changed) {
      listRef.current?.resetAfterIndex(0, true); // force full relayout
      prevRowHeightsRef.current = rowHeights;
    }
  }, [rowHeights]);

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

  // console.log('GridView render');

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

  const allMediaItems = getFilteredMediaItems(state);

  const dimensionsSignature = allMediaItems
    .map(mi => `${mi.uniqueId}:${mi.width}x${mi.height}`)
    .join('|');

  return {
    sidebarOpen: getSidebarOpen(state),
    rightPanelOpen: getRightPanelOpen(state),
    appInitialized: getAppInitialized(state),
    numGridColumns: getNumGridColumns(state),
    allMediaItems,
    savedScrollOffset: getScrollPosition(state),
    displayMetadata: getDisplayMetadata(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    dimensionsSignature,
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSaveScrollOffset: setScrollPositionRedux,
    onSetPhotoState: setPhotoState,
    onReloadMediaItemsByViewSpec: loadAndReplaceMediaItemsByViewSpec,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
