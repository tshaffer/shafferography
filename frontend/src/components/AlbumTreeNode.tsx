import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';

import {
  ListItemText,
  Checkbox,
  ListItemButton,
} from '@mui/material';

import { setDisplayedAlbumNodeIds, setSelectedAlbumNodeIdsRedux, TedTaggerDispatch } from '../models';
import { LeafAlbumNode, StringToNumberLUT } from '../types';
import { getDisplayedAlbumNodeIds, getMediaItemCountByAlbumNode, getSelectedAlbumNodeIds } from '../selectors';
import { reloadMediaItemsByViewSpec } from '../controllers';

export interface AlbumTreeNodeProps {
  item: LeafAlbumNode;
  displayedAlbumNodeIds: string[];
  onSetDisplayedAlbumNodeIds: (displayedAlbumNodeIds: string[]) => void;
  onReloadMediaItemsByViewSpec: () => any;
  selectedNodeIds: Set<string>;
  mediaItemCountByAlbumNode: StringToNumberLUT;
  onSetSelectedNodeIds: (selectedNodeIds: Set<string>) => any;
}

function AlbumTreeNode(props: AlbumTreeNodeProps) {
  const { item, displayedAlbumNodeIds, onSetDisplayedAlbumNodeIds, onReloadMediaItemsByViewSpec } = props;

  const getItemLabel = (item: LeafAlbumNode) => item.name;

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

  const getItemCount = (item: LeafAlbumNode): string => {
    if (!props.mediaItemCountByAlbumNode || !props.mediaItemCountByAlbumNode[item.id]) {
      return '0';
    }
    const count = props.mediaItemCountByAlbumNode[item.id];
    return count ? count.toString() : '0';
  };

  return (
    <ListItemButton
      key={getItemLabel(item)}
      sx={{ paddingLeft: '5px', paddingY: 0.2 }}
    >
      <Checkbox
        checked={isChecked}
        onChange={toggleSelection}
      />
      <ListItemText
        primary={getItemLabel(item)}
        onClick={(e) => {
          const newSet = new Set(props.selectedNodeIds);
          if (newSet.has(props.item.id)) {
            newSet.delete(props.item.id);
          } else {
            newSet.add(props.item.id);
          }
          props.onSetSelectedNodeIds(newSet);
        }}
      />
      <span>({getItemCount(item)})</span>
    </ListItemButton>
  );
}

const mapStateToProps = (state: any) => ({
  displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
  selectedNodeIds: getSelectedAlbumNodeIds(state),
  mediaItemCountByAlbumNode: getMediaItemCountByAlbumNode(state),
});

const mapDispatchToProps = (dispatch: TedTaggerDispatch) =>
  bindActionCreators(
    {
      onSetDisplayedAlbumNodeIds: setDisplayedAlbumNodeIds,
      onSetSelectedNodeIds: setSelectedAlbumNodeIdsRedux,
      onReloadMediaItemsByViewSpec: reloadMediaItemsByViewSpec,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeNode);
