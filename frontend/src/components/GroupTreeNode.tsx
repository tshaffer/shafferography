import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { setSelectedAlbumNodeIdsRedux, TedTaggerDispatch } from '../models';
import { GroupNode } from '../types';
import { getSelectedMediaContentNodeIds } from '../selectors';

export interface GroupTreeNodeProps {
  item: GroupNode;
  selectedNodeIds: Set<string>;
  onSetSelectedNodeIds: (selectedNodeIds: Set<string>) => any;
}

function GroupTreeNode(props: GroupTreeNodeProps) {
  const { item } = props;

  const getItemLabel = (item: GroupNode) => item.name;


  return (
    <ListItemButton
      key={getItemLabel(item)}
      sx={{ paddingLeft: '5px', paddingY: 0.2 }}
    >
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
    </ListItemButton>
  );
}

const mapStateToProps = (state: any) => ({
  selectedNodeIds: getSelectedMediaContentNodeIds(state),
});

const mapDispatchToProps = (dispatch: TedTaggerDispatch) =>
  bindActionCreators(
    {
      onSetSelectedNodeIds: setSelectedAlbumNodeIdsRedux,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(GroupTreeNode);
