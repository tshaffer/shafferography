import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';

import {
  ListItemText,
  Checkbox,
  ListItemButton,
} from '@mui/material';

import { setDisplayedAlbumNodeIds, TedTaggerDispatch } from '../models';
import { LeafAlbumNode } from '../types';
import { getDisplayedAlbumNodeIds } from '../selectors';
import { reloadMediaItemsByViewSpec } from '../controllers';

export interface AlbumTreeNodeProps {
  item: LeafAlbumNode;
  displayedAlbumNodeIds: string[];
  onSetDisplayedAlbumNodeIds: (displayedAlbumNodeIds: string[]) => void;
  onReloadMediaItemsByViewSpec: () => any;
}

function AlbumTreeNode(props: AlbumTreeNodeProps) {
  const { item, displayedAlbumNodeIds, onSetDisplayedAlbumNodeIds, onReloadMediaItemsByViewSpec } = props;

  const getItemLabel = (item: LeafAlbumNode) => item.name;

  const isChecked = displayedAlbumNodeIds.includes(item.id);

  console.log(isChecked, item.name, item.id);
  
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
    return '69';
    // Placeholder - replace with actual logic if needed
  };

  return (
    <ListItemButton
      key={getItemLabel(item)}
      onClick={toggleSelection}
      sx={{ paddingLeft: '5px', paddingY: 0.2 }}
    >
      <Checkbox checked={isChecked} />
      <ListItemText primary={getItemLabel(item)} />
      <span>({getItemCount(item)})</span>
    </ListItemButton>
  );
}

const mapStateToProps = (state: any) => ({
  displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
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
