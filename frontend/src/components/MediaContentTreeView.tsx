import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { styled } from '@mui/material/styles';
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
  Box,
  ButtonGroup,
  Typography,
} from '@mui/material';
import { setSelectedAlbumNodeIdsRedux, TedTaggerDispatch } from '../models';
import { MediaContentNode, GroupNode, AlbumNode, MediaContentNodeType } from '../types';
import { addAlbumToTree, addGroupToTree, moveNodeInTree, deleteNodes, renameNode } from '../controllers';
import { getMediaContentTree, getSelectedMediaContentNodeIds } from '../selectors';
import AlbumTreeNode from './AlbumTreeNode';
import GroupTreeNode from './GroupTreeNode';
import ImportFromDriveDialog from './ImportFromDriveDialog';

interface MediaContentTreeViewProps {
  mediaContentNodes: MediaContentNode[];
  selectedNodeIds: Set<string>;
  onSetSelectedNodeIds: (selectedNodeIds: Set<string>) => any;
  onAddAlbumToTree: (name: string, parentId?: string) => void;
  onAddGroupToTree: (name: string, parentId?: string) => void;
  onMoveNodeInTree: (nodeId: string, newParentId: string) => void;
  onDeleteNodes: (nodeIds: string[]) => void;
  onRenameNode: (nodeId: string, newName: string) => void;
}

function MediaContentTreeView(props: MediaContentTreeViewProps) {

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [newParentId, setNewParentId] = useState<string | null>(null);

  const [importFromDriveDialogOpen, setImportFromDriveDialogOpen] = useState(false);

  const [contextMenuPosition, setContextMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<string | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<MediaContentNode | null>(null);

  const getAllGroupNodes = (nodes: MediaContentNode[]): MediaContentNode[] => {
    const result: MediaContentNode[] = [];

    const traverse = (nodeList: MediaContentNode[]) => {
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

  const getAlbumNodeJsx = (node: AlbumNode): JSX.Element => {
    return (
      <AlbumTreeNode item={node} />
    );
  }

  const getGroupNodeJsx = (node: GroupNode): JSX.Element => {
    return (
      <GroupTreeNode item={node} />
    );
  };

  const getNodeLabel = (node: MediaContentNode): JSX.Element | null => {
    if (node.type === MediaContentNodeType.Group) {
      return getGroupNodeJsx(node as GroupNode);
    } else if (node.type === MediaContentNodeType.Album) {
      return getAlbumNodeJsx(node as AlbumNode);
    }
    return null;
  };

  const findNodeById = (nodes: MediaContentNode[], id: string): MediaContentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === 'group') {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const sortNodes = (nodes: MediaContentNode[]): MediaContentNode[] => {
    return nodes
      .slice() // avoid mutating original array
      .sort((a, b) => {
        // Sort by type: groups before albums
        if (a.type === 'group' && b.type !== 'group') return -1;
        if (a.type !== 'group' && b.type === 'group') return 1;

        // Both are groups or both are albums: sort by name (case-insensitive)
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
  };

  const isNode = (node: MediaContentNode | null): boolean => {
    return node !== null;
  };

  const isAlbumNode = (node: MediaContentNode | null): node is AlbumNode => {
    return isNode(node) && node?.type === 'album';
  };

  const isNodeSelected = (contextMenuNode: MediaContentNode | null): boolean => {
    if (!contextMenuNode) {
      return false;
    }
    return (props.selectedNodeIds.size > 0);
  }

  const isSingleNodeSelected = (): boolean => {
    return props.selectedNodeIds.size === 1 && props.mediaContentNodes.some(node => props.selectedNodeIds.has(node.id));
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
    const node = findNodeById(props.mediaContentNodes, nodeId);
    if (node) {
      setRenameValue(renameValue);
      setRenameDialogOpen(false);
      props.onRenameNode(nodeId, renameValue);
    }
  };

  const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    '& .MuiTreeItem-content': {
      paddingLeft: '2px !important',
      paddingTop: '0px !important',
      paddingBottom: '0px !important',
      paddingRight: '0px !important',
      marginLeft: '0px !important',
      gap: 0,
    },
    '& .MuiTreeItem-label': {
      lineHeight: 0.5,
    },
    '& .MuiTreeItem-iconContainer': {
      marginLeft: 0,
      marginRight: 0,
    },
    '& [style*="--TreeView-itemDepth"]': {
      '--TreeView-itemDepth': '0 !important',
    },
  }));

  const renderTree = (node: MediaContentNode): React.ReactNode => {
    return (
      <CustomTreeItem
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
              e.stopPropagation();
            }}
            style={{
              cursor: 'pointer',
              backgroundColor: props.selectedNodeIds.has(node.id) ? '#e0f7fa' : 'transparent',
              border: props.selectedNodeIds.has(node.id) ? '1px solid #26c6da' : '1px solid transparent',
              borderRadius: 8,
              fontWeight: props.selectedNodeIds.has(node.id) ? 'bold' : 'normal',
              color: props.selectedNodeIds.has(node.id) ? '#006064' : 'inherit',
              boxShadow: props.selectedNodeIds.has(node.id) ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              display: 'inline-block',
            }}
          >
            {getNodeLabel(node)}
          </span>
        }
      >
        {node.type === 'group' && sortNodes(node.children).map(renderTree)}
      </CustomTreeItem>
    );
  };

  const renderContextMenu = (contextMenuNode: MediaContentNode | null): JSX.Element => {
    return (
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
        <MenuItem
          onClick={() => {
            setImportFromDriveDialogOpen(true);
            setContextMenuPosition(null);
            // setAddDialogOpen(true);
            // setContextMenuPosition(null);
          }}
          disabled={isAlbumNode(contextMenuNode)}
        >
          Import Album
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAddGroupDialogOpen(true);
            setContextMenuPosition(null);
          }}
          disabled={isAlbumNode(contextMenuNode)}
        >
          Add Group
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMoveDialogOpen(true);
            setContextMenuPosition(null);
          }}
          disabled={!isNodeSelected(contextMenuNode)}
        >
          Move To...
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRenameDialogOpen(true);
            setContextMenuPosition(null);
          }}
          disabled={!isSingleNodeSelected()}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onDeleteNodes(Array.from(props.selectedNodeIds));
            setContextMenuPosition(null);
          }}
          disabled={!isNodeSelected(contextMenuNode)}
        >
          Delete
        </MenuItem>
      </Menu>
    );
  }

  return (
    <React.Fragment>
      <Typography
        variant="subtitle1"
        sx={{ px: 2, mt: 2, fontWeight: 'bold' }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuNodeId(null);
          setContextMenuNode(null);
          setContextMenuPosition({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        }}
      >
        Photos
      </Typography>
      <Box>
        {props.mediaContentNodes.length === 0 ? (
          <Typography variant="body2">No Albums Available</Typography>
        ) : (
          <Box>
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '10px', marginBottom: 0, marginTop: 1 }}>
                <ButtonGroup size="small">
                  <Button
                    variant="outlined"
                    disabled={props.selectedNodeIds.size === 0}
                    onClick={() => props.onSetSelectedNodeIds(new Set())}
                  >
                    Deselect All
                  </Button>
                </ButtonGroup>
              </Box>
              {renderContextMenu(contextMenuNode)}
              <SimpleTreeView
                id='mediaContentTreeView'
                onSelectedItemsChange={(event, id) => {
                  setSelectedId(id ?? null);
                }}
                slots={{
                  expandIcon: ChevronRight as React.ComponentType<SvgIconProps>,
                  collapseIcon: ExpandMore as React.ComponentType<SvgIconProps>,
                }}
              >
                {sortNodes(props.mediaContentNodes).map(renderTree)}
              </SimpleTreeView>

              <ImportFromDriveDialog
                open={importFromDriveDialogOpen}
                onClose={() => setImportFromDriveDialogOpen(false)}
              />

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
                    {getAllGroupNodes(props.mediaContentNodes)
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
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}

function mapStateToProps(state: any) {
  return {
    mediaContentNodes: getMediaContentTree(state),
    selectedNodeIds: getSelectedMediaContentNodeIds(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentTreeView);
