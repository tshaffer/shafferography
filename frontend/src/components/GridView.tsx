import * as React from 'react';
import { VariableSizeList as List } from 'react-window';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FilteredMediaItemPicker, GridRowData, MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getFilteredMediaItems, getMediaItems, getNumGridColumns } from '../selectors';
import { getGridRowHeight } from '../utilities';
import { targetHeights } from '../constants';
import GridRow from './GridRow';

export interface GridViewProps {
  appInitialized: boolean;
  numGridColumns: number;
  allMediaItems: FilteredMediaItemPicker[];
}

const GridView = ({ setTooltip, ...props }: GridViewProps & {
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void
}) => {

  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);
  const listRef = React.useRef<List>(null);

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

    while (mediaItemIndex < props.allMediaItems.length - 1) {
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
    [gridRows, setTooltip] // Memoize based on dependencies
  );

  const getItemSize = (index: number) => rowHeights[index];

  // console.log('GridView rerender');

  return (
    <div ref={gridContainerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <List
        itemSize={getItemSize}
        ref={listRef}
        height={window.innerHeight}
        itemCount={gridRows.length}
        width="100%"
      >
        {renderRow}
      </List>
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  const filteredMediaItems: FilteredMediaItemPicker[] = getFilteredMediaItems(state);
  console.log('filteredMediaItems', filteredMediaItems);
  
  return {
    appInitialized: getAppInitialized(state),
    numGridColumns: getNumGridColumns(state),
    allMediaItems: filteredMediaItems,
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
