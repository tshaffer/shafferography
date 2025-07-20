import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { v4 as uuidv4 } from 'uuid';

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
import { TedTaggerDispatch } from '../models';
import { MediaContentNode, GroupNode, AlbumNode, MediaContentNodeType } from '../types';
import { addAlbumToTree, addGroupToTree, moveNodeInTree, deleteNodes, renameNode } from '../controllers';
import { getDisplayedAlbumNodeIds, getMediaContentTree } from '../selectors';
import AlbumTreeNode from './AlbumTreeNode';
import GroupTreeNode from './GroupTreeNode';
import ImportFromDriveDialog from './ImportFromDriveDialog';
import { isAlbumNode } from '../utilities';
import ConfirmationDialog from './ConfirmationDialog';

interface MediaContentTreeViewProps {
  mediaContentNodes: MediaContentNode[];
  displayedAlbumNodeIds: string[];
  onAddAlbumToTree: (mediaContentNode: MediaContentNode, parentId?: string) => void;
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
  const [importMediaContentParentNode, setImportMediaContentParentNode] = useState<MediaContentNode | null>(null);

  const [contextMenuPosition, setContextMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<string | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<MediaContentNode | null>(null);

  const [expandedGroupIds, setExpandedGroupIds] = useState<string[] | null>(null);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  React.useEffect(() => {
    if (
      props.mediaContentNodes.length > 0 &&
      expandedGroupIds === null
    ) {
      try {
        const allExpandedIds = getExpandedNodeIdsWithAncestors(props.mediaContentNodes, props.displayedAlbumNodeIds);
        setExpandedGroupIds(allExpandedIds);
      } catch (e) {
        console.error('Error computing expanded group IDs:', e);
      }
    }
  }, [props.mediaContentNodes, props.displayedAlbumNodeIds, expandedGroupIds]);

  function getExpandedNodeIdsWithAncestors(
    nodes: MediaContentNode[],
    initiallyExpandedIds: string[]
  ): string[] {
    const parentMap = new Map<string, string | null>();

    const buildParentMap = (node: MediaContentNode, parentId: string | null) => {
      parentMap.set(node.id, parentId);
      if ((node as GroupNode).children) {
        (node as GroupNode).children.forEach(child => buildParentMap(child, node.id));
      }
    };

    // Build the map of child -> parent
    nodes.forEach(root => buildParentMap(root, null));

    // For each initially expanded ID, add it and all its ancestors
    const resultSet = new Set<string>();

    initiallyExpandedIds.forEach(id => {
      let currentId: string | null | undefined = id;
      while (currentId) {
        resultSet.add(currentId);
        currentId = parentMap.get(currentId);
      }
    });

    return Array.from(resultSet);
  }

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

  const getNodeLabelJSX = (node: MediaContentNode): JSX.Element | null => {
    if (node.type === MediaContentNodeType.Group) {
      return getGroupNodeJsx(node as GroupNode);
    } else if (node.type === MediaContentNodeType.Album) {
      return getAlbumNodeJsx(node as AlbumNode);
    }
    return null;
  };

  const getNodeName = (node: MediaContentNode | null): string => {
    if (!node) {
      return '';
    } else {
      return node.name;
    }
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

  const handleAddAlbum = () => {
    if (!newAlbumName.trim()) return;
    const newAlbum: MediaContentNode = {
      id: uuidv4(),
      name: newAlbumName,
      type: MediaContentNodeType.Album,
    };

    props.onAddAlbumToTree(newAlbum, selectedId ?? undefined);
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
    const nodeId: string = contextMenuNodeId!;
    const node = findNodeById(props.mediaContentNodes, nodeId);
    if (node) {
      setRenameValue(renameValue);
      setRenameDialogOpen(false);
      props.onRenameNode(nodeId, renameValue);
    }
  };

  const handleDeleteNode = () => {
    setConfirmDeleteDialogOpen(true);
    setContextMenuPosition(null);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteDialogOpen(false);
    props.onDeleteNodes([contextMenuNode!.id]);
    setContextMenuPosition(null);
  };

  const CustomGroupTreeItem = styled(TreeItem)(({ theme }) => ({
    '& .MuiTreeItem-content': {
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
  }));

  /*
    // '& .MuiTreeItem-content': {
    //   paddingTop: '1px !important',
    //   paddingBottom: '2px !important',
    //   paddingRight: '3px !important',
    //   marginLeft: '4px !important',
    //   gap: 0,
    // },
  */
  const CustomAlbumTreeItem = styled(TreeItem)(({ theme }) => ({
    '& .MuiSimpleTreeView-itemContent': {
      paddingTop: '0px !important',
      paddingBottom: '0px !important',
      paddingRight: '0px !important',
      marginLeft: '0px !important',
      gap: 0,
    },
  }));

  const renderTree = (node: MediaContentNode, depth: number): React.ReactElement => {
    if (node.type === MediaContentNodeType.Group) {
      return (
        <CustomGroupTreeItem
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
                paddingLeft: `${depth * 4}px`,  // ← Manual indentation
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: 8,
                fontWeight: 'normal',
                color: 'inherit',
                boxShadow: 'none',
                display: 'inline-block',
              }}
            >
              {getNodeLabelJSX(node)}
            </span>
          }
        >
          {node.type === 'group' &&
            sortNodes(node.children).map(child => renderTree(child, depth + 1))}
        </CustomGroupTreeItem>
      );
    } else {
      return (
        <CustomAlbumTreeItem
          key={node.id}
          itemId={node.id}
          sx={{
            '& > .MuiTreeItem-content': {
              paddingLeft: `${(depth - 1) * 16}px`, // ← Adjust base indentation here (e.g., 16px per level)
            },
          }}
          style={{
            paddingLeft: '0px',
          }}
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
                paddingLeft: '1px',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: 8,
                fontWeight: 'normal',
                color: 'inherit',
                boxShadow: 'none',
                display: 'inline-block',
              }}
            >
              {getNodeLabelJSX(node)}
            </span>
          }
        >
        </CustomAlbumTreeItem>
      );
    }
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
        {!isAlbumNode(contextMenuNode) && (<MenuItem
          onClick={() => {
            setImportMediaContentParentNode(contextMenuNode);
            setImportFromDriveDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Import Album
        </MenuItem>
        )}
        {isAlbumNode(contextMenuNode) && (<MenuItem
          onClick={() => {
            setImportMediaContentParentNode(contextMenuNode);
            setImportFromDriveDialogOpen(true);
            setContextMenuPosition(null);
          }}
        >
          Import Photos
        </MenuItem>
        )}
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
            handleDeleteNode();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    );
  }

  const contextMenuNodeName: string = getNodeName(contextMenuNode);

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

              {renderContextMenu(contextMenuNode)}

              {expandedGroupIds !== null && (
                <SimpleTreeView
                  id='mediaContentTreeView'
                  onSelectedItemsChange={(event, id) => {
                    setSelectedId(id ?? null);
                  }}
                  defaultExpandedItems={expandedGroupIds}
                  slots={{
                    expandIcon: ChevronRight as React.ComponentType<SvgIconProps>,
                    collapseIcon: ExpandMore as React.ComponentType<SvgIconProps>,
                  }}
                >
                  {sortNodes(props.mediaContentNodes).map(node => renderTree(node, 0))}
                </SimpleTreeView>
              )}

              <ImportFromDriveDialog
                open={importFromDriveDialogOpen}
                parentMediaContentNode={importMediaContentParentNode!}
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
                <DialogTitle>Move Selected Album/Group</DialogTitle>
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
                      .filter(n => contextMenuNodeId !== n.id)
                      .map(n => (
                        <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
                      ))}
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setMoveDialogOpen(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      props.onMoveNodeInTree(contextMenuNodeId!, newParentId!);
                      setMoveDialogOpen(false);
                      setNewParentId(null);
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

              <ConfirmationDialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message={'Are you sure you want to delete ' + contextMenuNodeName + '?'}
              />

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
    displayedAlbumNodeIds: getDisplayedAlbumNodeIds(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddAlbumToTree: addAlbumToTree,
    onAddGroupToTree: addGroupToTree,
    onMoveNodeInTree: moveNodeInTree,
    onDeleteNodes: deleteNodes,
    onRenameNode: renameNode,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentTreeView);

