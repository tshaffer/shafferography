import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from "@mui/material";
import { MediaContentNode, MediaContentNodeType } from "../types";
import { TedTaggerDispatch } from "../models";
import { MediaItem } from '@shared/types/mediaItem';


export interface MovePhotosDialogProps {
  open: boolean;
  onClose: () => void;
  mediaContentNodes: MediaContentNode[];
  mediaItemsToMove: MediaItem[];
  onMovePhotos: (newAlbumId: string) => void;
}

function MovePhotosDialog(props: MovePhotosDialogProps) {

  const [newAlbumId, setNewAlbumId] = useState<string | null>(null);

  const getAllAlbumNodes = (nodes: MediaContentNode[]): MediaContentNode[] => {
    const result: MediaContentNode[] = [];

    const traverse = (nodeList: MediaContentNode[]) => {
      for (const node of nodeList) {
        if (node.type === MediaContentNodeType.Group) {
          result.push(node);
          traverse(node.children);
        } else if (node.type === MediaContentNodeType.Album) {
          result.push(node);
        }
      }
    };

    traverse(nodes);
    return result;
  };


  const handleMovePhotos = () => {
    props.onMovePhotos(newAlbumId!);
    props.onClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  if (!props.open) {
    return null;
  }

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Move Photos</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="New Album"
          fullWidth
          value={newAlbumId ?? ''}
          onChange={(e) => setNewAlbumId(e.target.value)}
        >
          <MenuItem value="" disabled>Select album</MenuItem>
          {getAllAlbumNodes(props.mediaContentNodes)
            .map(n => (
              <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
            ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleMovePhotos} disabled={!newAlbumId}>Move</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(MovePhotosDialog);
