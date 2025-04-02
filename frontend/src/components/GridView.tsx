import * as React from 'react';
import { VariableSizeList } from 'react-window';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FilteredMediaItemPicker, GridRowData, MediaItem } from '../types';
import { setScrollPositionRedux, TedTaggerDispatch } from '../models';
import { getAppInitialized, getFilteredMediaItems, getNumGridColumns } from '../selectors';
import { getGridRowHeight } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';

export interface GridViewProps {
  appInitialized: boolean;
  numGridColumns: number;
  allMediaItems: FilteredMediaItemPicker[];
  savedScrollOffset: number;
  onSaveScrollOffset: (offset: number) => void;
}

const GridView = ({
  setTooltip,
  savedScrollOffset,
  ...props
}: GridViewProps & {
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void;
  // onSaveScrollOffset: (offset: number) => void;
}) => {
  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);
  const listRef = React.useRef<VariableSizeList>(null);

  // Update grid width on mount and on window resize.
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

  // Compute row data based on grid width and the list of media items.
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

  // Render each row using GridRow.
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
            setTooltip={setTooltip}
          />
        </div>
      );
    },
    [gridRows, setTooltip]
  );

  const getItemSize = (index: number) => rowHeights[index];
  const listHeight = window.innerHeight - 112;

  // Capture scroll offset as the user scrolls.
  const handleScroll = ({
    scrollOffset,
    scrollDirection,
    scrollUpdateWasRequested,
  }: {
    scrollOffset: number;
    scrollDirection: string;
    scrollUpdateWasRequested: boolean;
  }) => {
    // Save the scroll position. In this example, we dispatch an action.
    // onSaveScrollOffset && onSaveScrollOffset(scrollOffset);
    props.onSaveScrollOffset(scrollOffset);
    console.log('scrollOffset:', scrollOffset);
    console.log('scrollDirection:', scrollDirection);
    console.log('scrollUpdateWasRequested:', scrollUpdateWasRequested);
  };

  // const onSaveScrollOffset: (offset: number) => void = (offset: number) => {
  // }

  return (
    <div ref={gridContainerRef} style={{ width: '100%', overflow: 'hidden' }} id="variableSizeListContainer">
      <VariableSizeList
        ref={listRef}
        // Restore scroll position on mount using the saved offset
        initialScrollOffset={savedScrollOffset || 0}
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
    // Assume the grid scroll offset is stored in the state as gridScrollOffset
    savedScrollOffset: state.gridScrollOffset || 0,
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators(
    {
      onSaveScrollOffset: setScrollPositionRedux,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
