import { connect } from 'react-redux';

import {
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { GroupNode } from '../types';

export interface GroupTreeNodeProps {
  item: GroupNode;
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
        
      />
    </ListItemButton>
  );
}

const mapStateToProps = (state: any) => ({
});

export default connect(mapStateToProps)(GroupTreeNode);
