import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { VariableSizeList as List } from 'react-window';

import { GridRowData, MediaItem, PhotoLayout } from '../types';
import { setScrollPositionRedux, TedTaggerDispatch } from '../models';
import { getAppInitialized, getMediaItems, getNumGridColumns, getScrollPosition, getDisplayMetadata } from '../selectors';
import GridRow from './GridRow';
import { getGridRowHeight } from '../utilities';
import { centerColumnWidth, targetHeights, metadataRowHeight } from '../constants';
import { selectPhoto } from '../controllers';
import { setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[];
  numGridColumns: number;
  scrollPosition: number;
  displayMetadata: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
  onSetScrollPosition: (scrollPosition: number) => void;
}

const GridView = (props: GridViewProps) => {
  const listRef = React.useRef<List>(null);
  const scrollPositionRef = React.useRef(0); // ✅ Store scroll position in a ref
  const hasRestoredScroll = React.useRef(false); // 🛠️ Track whether we've restored scroll

  // Generate row data dynamically
  const gridRows: GridRowData[] = React.useMemo(() => {
    const rows: GridRowData[] = [];
    let mediaItemIndex = 0;
    while (mediaItemIndex < props.allMediaItems.length) {
      const baseRowHeight = getGridRowHeight(
        centerColumnWidth,
        targetHeights[props.numGridColumns - 2],
        props.allMediaItems,
        mediaItemIndex,
        props.allMediaItems.length - 1
      );

      // ✅ Adjust row height if metadata is displayed
      const rowData = {
        ...baseRowHeight,
        rowHeight: baseRowHeight.rowHeight + (props.displayMetadata ? metadataRowHeight : 0),
      };

      mediaItemIndex += rowData.numMediaItems;
      rows.push(rowData);
    }
    return rows;
  }, [props.allMediaItems, props.numGridColumns, props.displayMetadata]);

  // Function to dynamically return row height
  const getRowHeight = (index: number) => gridRows[index].rowHeight;

  // Notify react-window that row heights have changed
  React.useEffect(() => {
    listRef.current?.resetAfterIndex(0, false);
  }, [props.displayMetadata]);

  React.useEffect(() => {
    return () => {
      console.log("📌 Storing scroll position in Redux on unmount:", scrollPositionRef.current);
      props.onSetScrollPosition(scrollPositionRef.current); // ✅ Store last scroll position in Redux
    };
  }, []);

  // Restore scroll position when component mounts (delayed to ensure list is ready)
  React.useEffect(() => {
    if (listRef.current && !hasRestoredScroll.current) {
      setTimeout(() => {
        listRef.current?.scrollTo(props.scrollPosition);
        hasRestoredScroll.current = true; // Prevents re-applying scroll unnecessarily
      }, 50); // Small delay ensures the list is fully mounted
    }
  }, [props.scrollPosition]);

  const handleScroll = React.useCallback(
    debounce((event) => {
      const newScrollPosition = event.scrollOffset;

      // ✅ Store in ref, but don't update Redux on every scroll
      if (Math.abs(newScrollPosition - scrollPositionRef.current) > 5) {
        scrollPositionRef.current = newScrollPosition;
      }
    }, 100),
    []
  );

  // ✅ Memoized Row Renderer
  const RowRenderer = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rowData = gridRows[index];

    // ✅ Memoize style to avoid unnecessary re-renders
    const stableStyle = React.useMemo(() => ({ ...style }), [style]);

    return (
      <div style={stableStyle}>
        <GridRow
          {...rowData}
          displayMetadata={props.displayMetadata}
          onClickPhoto={props.onClickPhoto}
          onSetLoupeViewMediaItemId={props.onSetLoupeViewMediaItemId}
          onSetPhotoLayoutRedux={props.onSetPhotoLayoutRedux}
        />
      </div>
    );
  });

  const prevPropsRef = React.useRef<GridViewProps | null>(null);

  prevPropsRef.current = props; // Update previous props after comparison

  return (
    <List
      ref={listRef}
      height={window.innerHeight - 100}
      itemCount={gridRows.length}
      itemSize={getRowHeight}
      width={centerColumnWidth}
      onScroll={handleScroll} // ✅ Keeps debounced scroll tracking
    >
      {RowRenderer}
    </List>
  );
};

function mapStateToProps(state: any) {
  const props = {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    numGridColumns: getNumGridColumns(state),
    scrollPosition: getScrollPosition(state),
    displayMetadata: getDisplayMetadata(state),
  };
  return props;
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onClickPhoto: selectPhoto,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetPhotoLayoutRedux: setPhotoLayoutRedux,
    onSetScrollPosition: setScrollPositionRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);
