import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TedTaggerDispatch } from '../models';
import { getDisplayMetadata, getMediaItems } from '../selectors';
import GridCell from './GridCell';
import { bordersSize } from '../constants';
import { deselectAllPhotos, selectPhoto, selectAllPhotos } from '../controllers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'react-redux';

export interface GridRowPropsFromParent {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
  setTooltip: (tooltip: { text: string; position: { top: number; left: number } } | null) => void; // Add setTooltip prop
}

export interface GridRowProps extends GridRowPropsFromParent {
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onDeselectAllPhotos: () => void;
  onSelectAllPhotos: () => void;
}

const GridRow = (props: GridRowProps) => {

  // console.log('GridRow:', props);

  // React.useEffect(() => {
  //   console.log(`GridRow mounted: mediaItemIndex: ${props.mediaItemIndex}`);
  //   return () => console.log(`GridRow ${props.mediaItemIndex} unmounted`);
  // }, []);
  
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const allMediaItems = useSelector(getMediaItems, shallowEqual);
  const displayMetadata = useSelector(getDisplayMetadata);

  if (allMediaItems.length === 0) {
    return null;
  }

  /** Handles photo selection with shift-click support */
  const handlePhotoClick = (mediaItemId: string, index: number, commandKey: boolean, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null) {
      // Select all photos in the range between lastSelectedIndex and index
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      for (let i = start; i <= end; i++) {
        props.onClickPhoto(allMediaItems[i].uniqueId, false, false);
      }
    } else {
      props.onClickPhoto(mediaItemId, commandKey, shiftKey);
    }

    setLastSelectedIndex(index);
  };

  /** Handles keyboard shortcuts (Ctrl + A for select all, Esc for deselect all) */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        props.onSelectAllPhotos();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        props.onDeselectAllPhotos();
        setLastSelectedIndex(null);
      }
    };

    if (document.getElementById("global-keydown-listener") === null) {
      document.addEventListener('keydown', handleKeyDown);
      const marker = document.createElement("div");
      marker.id = "global-keydown-listener";
      document.body.appendChild(marker);
    }

    return () => {
      if (document.getElementById("global-keydown-listener") !== null) {
        document.removeEventListener('keydown', handleKeyDown);
        document.getElementById("global-keydown-listener")?.remove();
      }
    };
  }, []);

  const getGridCell = (mediaItemIndex: number, cellWidth: number): JSX.Element => {
    return (
      <GridCell
        key={mediaItemIndex}
        mediaItemIndex={mediaItemIndex}
        mediaItem={allMediaItems[mediaItemIndex]}
        rowHeight={props.rowHeight}
        cellWidth={cellWidth}
        setTooltip={props.setTooltip} // Pass tooltip handler to GridCell
      />
    );
  };

  const getGridCells = (): JSX.Element[] => {
    const gridCells: JSX.Element[] = [];
    for (let index = props.mediaItemIndex; index < props.mediaItemIndex + props.numMediaItems; index++) {
      const cellWidth = props.cellWidths[index - props.mediaItemIndex];
      gridCells.push(getGridCell(index, cellWidth));
    }
    return gridCells;
  };

  const gridCells = getGridCells();
  const metadataHeight: number = displayMetadata ? 60 : 0;
  const heightAttribute = `${props.rowHeight + metadataHeight + bordersSize}px`;

  // console.log('gridRow rerender:');
  // console.log(displayMetadata);
  // console.log(heightAttribute);
  // console.log(props.rowHeight + metadataHeight + bordersSize);

  return (
    <div style={{ height: heightAttribute, backgroundColor: 'white' }}>
      {gridCells}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators(
    {
      onClickPhoto: selectPhoto,
      onDeselectAllPhotos: deselectAllPhotos,
      onSelectAllPhotos: selectAllPhotos,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GridRow);
