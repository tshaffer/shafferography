import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  ListItemText,
  Checkbox,
  ListItemButton,
} from "@mui/material";
import { setDisplayedAlbumNodeIds, TedTaggerDispatch } from '../models';
import { LeafAlbumNode } from '../types';
import React from 'react';
import { getDisplayedAlbumNodeIds } from '../selectors';

export interface AlbumTreeNodeProps {
  item: LeafAlbumNode;
  displayedAlbumNodeIds: string[];
  onSetDisplayedAlbumNodeIds: (displayedAlbumNodeIds: string[]) => void;
}

function AlbumTreeNode(props: AlbumTreeNodeProps) {

  const [selected, setSelected] = React.useState(false);

  const getItemLabel = (item: LeafAlbumNode) => item.name;

  const toggleSelection = () => {
    
  const displayedAlbumNodeIds = props.displayedAlbumNodeIds;
    const index = displayedAlbumNodeIds.indexOf(props.item.id);
    if (index !== -1) {
      // If the item is already selected, remove it from the displayed list
      displayedAlbumNodeIds.splice(index, 1);
      props.onSetDisplayedAlbumNodeIds([...displayedAlbumNodeIds]);
    } else {
      // If the item is not selected, add it to the displayed list
      displayedAlbumNodeIds.push(props.item.id);
      props.onSetDisplayedAlbumNodeIds([...displayedAlbumNodeIds]);
    }
    localStorage.setItem('displayedAlbumNodeIds', displayedAlbumNodeIds.join(','));
    setSelected(!selected);

  };

  const getItemCount = (item: LeafAlbumNode): string => {
    return '69';
    // if (!props.mediaItemCountByAlbum || !props.mediaItemCountByAlbum[item.albumId]) {
    //   return '0';
    // }
    // const count = props.mediaItemCountByAlbum[item.albumId];
    // return count ? count.toString() : '0';
  };


  return (
    <ListItemButton
      key={getItemLabel(props.item)}
      onClick={() => toggleSelection()}
      sx={{ paddingLeft: '5px', paddingY: 0.2 }}
    >
      <Checkbox checked={selected} />
      <ListItemText primary={getItemLabel(props.item)} />
      {(
        <span>({getItemCount!(props.item)})</span>
      )}
    </ListItemButton>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetDisplayedAlbumNodeIds: setDisplayedAlbumNodeIds,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeNode);

