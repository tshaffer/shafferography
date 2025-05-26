import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  ListItemText,
  Checkbox,
  ListItemButton,
} from "@mui/material";
import { TedTaggerDispatch } from '../models';
import { LeafAlbumNode } from '../types';
import React from 'react';

export interface AlbumTreeNodeProps {
  item: LeafAlbumNode;
}

function AlbumTreeNode(props: AlbumTreeNodeProps) {

  const [selected, setSelected] = React.useState(false);

  const getItemLabel = (item: LeafAlbumNode) => item.name;

  const toggleSelection = () => {
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
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeNode);

