import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { setSelectedAlbumNodeIdsRedux, TedTaggerDispatch } from '../models';
import { AlbumNode, GroupNode, LeafAlbumNode } from '../types';
import { addAlbumToTree, addGroupToTree, moveNodeInTree, deleteNodes, renameNode } from '../controllers';
import { getAlbumTree, getSelectedAlbumNodeIds } from '../selectors';
import AlbumTreeNode from './AlbumTreeNode';
import GroupTreeNode from './GroupTreeNode';

interface AlbumTreeViewProps {
  nodes: AlbumNode[];
  selectedNodeIds: Set<string>;
  onSetSelectedNodeIds: (selectedNodeIds: Set<string>) => any;
  onAddAlbumToTree: (name: string, parentId?: string) => void;
  onAddGroupToTree: (name: string, parentId?: string) => void;
  onMoveNodeInTree: (nodeId: string, newParentId: string) => void;
  onDeleteNodes: (nodeIds: string[]) => void;
  onRenameNode: (nodeId: string, newName: string) => void;
}

function AlbumTreeView(props: AlbumTreeViewProps) {

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [newParentId, setNewParentId] = useState<string | null>(null);

  const [contextMenuPosition, setContextMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<string | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<AlbumNode | null>(null);

  const getAllGroupNodes = (nodes: AlbumNode[]): AlbumNode[] => {
    const result: AlbumNode[] = [];

    const traverse = (nodeList: AlbumNode[]) => {
      for (const node of nodeList) {
        if (node.type === 'group') {
          result.push(node);
          traverse(node.children);
        }
      }
    };

    traverse(nodes);
    return result;
  };

  const handleAddAlbum = () => {
    if (!newAlbumName.trim()) return;
    props.onAddAlbumToTree(newAlbumName, selectedId ?? undefined);
    setNewAlbumName('');
    setAddDialogOpen(false);
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    props.onAddGroupToTree(newGroupName, contextMenuNodeId ?? undefined);
    setNewGroupName('');
    setAddGroupDialogOpen(false);
  };

  const handleRenameNode = (e: any) => {
    const nodeId = Array.from(props.selectedNodeIds)[0];
    const node = findNodeById(props.nodes, nodeId);
    if (node) {
      setRenameValue(renameValue);
      setRenameDialogOpen(false);
      props.onRenameNode(nodeId, renameValue);
    }
  };

  const getAlbumNodeJsx = (node: LeafAlbumNode): JSX.Element => {
    return (
      <AlbumTreeNode item={node} />
    );
  }

  const getGroupNodeJsx = (node: GroupNode): JSX.Element => {
    return (
      <GroupTreeNode item={node} />
    );
  };

  const getNodeLabel = (node: AlbumNode): JSX.Element | null => {
    if (node.type === 'group') {
      return getGroupNodeJsx(node as GroupNode);
    } else if (node.type === 'album') {
      return getAlbumNodeJsx(node as LeafAlbumNode);
    }
    return null;
  };

  const renderTree = (node: AlbumNode): React.ReactNode => {
    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <span
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuNodeId(node.id);
              setContextMenuNode(node);
              setContextMenuPosition({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent expand/collapse when clicking label
            }}
            style={{
              cursor: 'pointer',
              backgroundColor: props.selectedNodeIds.has(node.id) ? '#e0f7fa' : 'transparent',
              borderRadius: 4,
              padding: '2px 6px',
              display: 'inline-block'
            }}
          >
            {getNodeLabel(node)}
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
      <Menu
        open={!!contextMenuPosition}
        onClose={() => setContextMenuPosition(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuPosition !== null
            ? { top: contextMenuPosition.mouseY, left: contextMenuPosition.mouseX }
            : undefined
        }
      >
        {contextMenuNode && contextMenuNode.type === 'group' && <MenuItem
          onClick={() => {
            setAddDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Import Album
        </MenuItem>}
        <MenuItem
          onClick={() => {
            setAddGroupDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Add Group
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMoveDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Move To...
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRenameDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onDeleteNodes(Array.from(props.selectedNodeIds));
            setContextMenuPosition(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
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

      <Dialog open={addGroupDialogOpen} onClose={() => setAddGroupDialogOpen(false)}>
        <DialogTitle>Add New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddGroupDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddGroup}
            disabled={!newGroupName.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={moveDialogOpen} onClose={() => setMoveDialogOpen(false)}>
        <DialogTitle>Move Selected Albums or Groups</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="New Parent"
            fullWidth
            value={newParentId ?? ''}
            onChange={(e) => setNewParentId(e.target.value)}
          >
            <MenuItem value="" disabled>Select new parent</MenuItem>
            {getAllGroupNodes(props.nodes)
              .filter(n => !props.selectedNodeIds.has(n.id))
              .map(n => (
                <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              for (const nodeId of Array.from(props.selectedNodeIds)) {
                props.onMoveNodeInTree(nodeId, newParentId!);
              }
              setMoveDialogOpen(false);
              setNewParentId(null);
              props.onSetSelectedNodeIds(new Set());
            }}
            disabled={!newParentId}
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Node</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="New Name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRenameNode}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
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
    onAddGroupToTree: addGroupToTree,
    onMoveNodeInTree: moveNodeInTree,
    onDeleteNodes: deleteNodes,
    onRenameNode: renameNode,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTreeView);
