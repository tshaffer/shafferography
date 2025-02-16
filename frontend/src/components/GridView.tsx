import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GridRowData, MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getMediaItems, getNumGridColumns, getScrollPosition } from '../selectors';
import { getGridRowHeight } from '../utilities';
import { centerColumnWidth, targetHeights } from '../constants';
import GridRow from './GridRow';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[],
  numGridColumns: number;
  scrollPosition: number;
}

const GridView = (props: GridViewProps) => {

  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = React.useState<number>(0);

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

    // console.log('props.numGridColumns: ', props.numGridColumns);
    const targetHeight = targetHeights[props.numGridColumns - 2];
    // console.log('targetHeight: ', targetHeight);
    
    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;

    while (mediaItemIndex < props.allMediaItems.length - 1) {
      const gridRowData: GridRowData = getGridRowHeight(
        gridWidth, // Use computed width instead of centerColumnWidth
        targetHeight,
        props.allMediaItems,
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

  const renderGridRow = (gridRowData: GridRowData): JSX.Element => {
    const { mediaItemIndex, numMediaItems, rowHeight, cellWidths } = gridRowData;
    return (
      <GridRow
        key={mediaItemIndex}
        mediaItemIndex={mediaItemIndex}
        numMediaItems={numMediaItems}
        rowHeight={rowHeight}
        cellWidths={cellWidths}
      />
    );
  };
  
  const gridRows: GridRowData[] = getGridRowData();

  return (
    <div ref={gridContainerRef} style={{ width: '100%', overflow: 'hidden' }}>
      {gridRows.map(renderGridRow)}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    numGridColumns: getNumGridColumns(state),
    scrollPosition: getScrollPosition(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
