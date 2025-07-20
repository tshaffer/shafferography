import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  ListItemText,
  Checkbox,
  ListItemButton,
} from '@mui/material';

import { setDisplayedAlbumNodeIds, TedTaggerDispatch } from '../models';
import { AlbumNode, StringToNumberLUT } from '../types';
import { getDisplayedAlbumNodeIds, getMediaItemCountByAlbumNode } from '../selectors';
import { reloadMediaItemsByViewSpec } from '../controllers';

export interface AlbumTreeNodeProps {
  item: AlbumNode;
  displayedAlbumNodeIds: string[];
  onSetDisplayedAlbumNodeIds: (displayedAlbumNodeIds: string[]) => void;
  onReloadMediaItemsByViewSpec: () => any;
  mediaItemCountByAlbumNode: StringToNumberLUT;  
}

function AlbumTreeNode(props: AlbumTreeNodeProps) {
  const { item, displayedAlbumNodeIds, onSetDisplayedAlbumNodeIds, onReloadMediaItemsByViewSpec } = props;

  const getItemLabel = (item: AlbumNode) => item.name;

  const isChecked = displayedAlbumNodeIds.includes(item.id);

  const toggleSelection = () => {
    let newDisplayedAlbumNodeIds: string[];

    if (isChecked) {
      // Remove the item
      newDisplayedAlbumNodeIds = displayedAlbumNodeIds.filter(id => id !== item.id);
    } else {
      // Add the item
      newDisplayedAlbumNodeIds = [...displayedAlbumNodeIds, item.id];
    }

    onSetDisplayedAlbumNodeIds(newDisplayedAlbumNodeIds);
    onReloadMediaItemsByViewSpec();
    localStorage.setItem('displayedAlbumNodeIds', newDisplayedAlbumNodeIds.join(','));
  };

  const getItemCount = (): string => {
    if (!props.mediaItemCountByAlbumNode || !props.mediaItemCountByAlbumNode[item.id]) {
      return '0';
    }
    const count = props.mediaItemCountByAlbumNode[item.id];
    return count ? count.toString() : '0';
  };

  const getListItemTextContent = () => {
    const count: string = '(' + getItemCount() + ')';
    const label: string = getItemLabel(item);

    return (
      <span style={{ display: 'flex', justifyContent: 'space-between', width: '154px' }}> {/* Adjust width as needed */}
        <span style={{ textAlign: 'left' }}>{label}</span>
        <span style={{ textAlign: 'right' }}>{count}</span>
      </span>
    );
  };

  return (
    <ListItemButton
      key={getItemLabel(item)}
      sx={{ paddingLeft: '0px' }}
    >
      <Checkbox
        sx={{ paddingLeft: '0px' }}
        checked={isChecked}
        onChange={toggleSelection}
      />
      <ListItemText
        primary={getListItemTextContent()}
      />
    </ListItemButton>
  );
}

const mapStateToProps = (state: any) => ({
  displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
  mediaItemCountByAlbumNode: getMediaItemCountByAlbumNode(state),
});

const mapDispatchToProps = (dispatch: TedTaggerDispatch) =>
  bindActionCreators(
    {
      onSetDisplayedAlbumNodeIds: setDisplayedAlbumNodeIds,
      onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeNode);
