import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { setSelectedAlbumNodeIdsRedux, TedTaggerDispatch } from '../models';
import { AlbumNode } from '../types';
import { addAlbumToTree } from '../controllers';
import { getAlbumTree, getSelectedAlbumNodeIds } from '../selectors';

interface AlbumTreeViewProps {
  nodes: AlbumNode[];
  selectedNodeIds: Set<string>;
  onSetSelectedNodeIds: (selectedNodeIds: Set<string>) => any;
  onAddAlbumToTree: (name: string, parentId?: string) => void;
}

function AlbumTreeView (props: AlbumTreeViewProps) {

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const handleAddAlbum = () => {
    if (!newAlbumName.trim()) return;
    props.onAddAlbumToTree(newAlbumName, selectedId ?? undefined);
    setNewAlbumName('');
    setAddDialogOpen(false);
    setSnackbarOpen(true);
  };

  const renderTree = (node: AlbumNode): React.ReactNode => {
    const label = node.name;

    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <span
            onClick={(e) => {
              if (e.shiftKey || e.metaKey || e.ctrlKey) {
                  const newSet = new Set(props.selectedNodeIds);
                  if (newSet.has(node.id)) {
                    newSet.delete(node.id);
                  } else {
                    newSet.add(node.id);
                  }
                props.onSetSelectedNodeIds(newSet);
              } else {
                setSelectedId(node.id);
              }
            }}
            style={{
              cursor: 'pointer',
              backgroundColor: props.selectedNodeIds.has(node.id) ? '#e0f7fa' : 'transparent',
              borderRadius: 4,
              padding: '2px 6px',
              display: 'inline-block'
            }}
          >
            {label}
          </span>
        }
      >
        {node.type === 'group' && node.children.map(renderTree)}
      </TreeItem>
    );
  };

  const findNodeById = (nodes: AlbumNode[], id: string): AlbumNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === 'group') {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <>
      <SimpleTreeView
        onSelectedItemsChange={(event, id) => {
          setSelectedId(id ?? null);
        }}
        slots={{
          expandIcon: ChevronRight as React.ComponentType<SvgIconProps>,
          collapseIcon: ExpandMore as React.ComponentType<SvgIconProps>,
        }}
      >
        {props.nodes.map(renderTree)}
      </SimpleTreeView>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Album</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Album Name"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddAlbum}
            disabled={!newAlbumName.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Successfully imported album!
        </Alert>
      </Snackbar>

    </>
  );
}

function mapStateToProps(state: any) {
  return {
    nodes: getAlbumTree(state),
    selectedNodeIds: getSelectedAlbumNodeIds(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetSelectedNodeIds: setSelectedAlbumNodeIdsRedux,
    onAddAlbumToTree: addAlbumToTree,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeView);
