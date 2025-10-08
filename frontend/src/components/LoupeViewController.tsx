// LoupeViewController.tsx
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoupeView from './LoupeView';
import { setPhotoState, loadAndReplaceMediaItemsByViewSpec } from '../controllers';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux } from '../models';
import { getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getMediaItems } from '../selectors';
import { Derivative, MediaItem, MediaManifest, PhotoState, ViewVariant } from '../types';
import { fetchManifest } from '../controllers';
import { LoupeVariantHeaderSwitch } from './LoupeVariantHeaderSwitch';
import { getPhotoUrl } from '../utilities';

export interface LoupeViewControllerProps {
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  mediaItems: MediaItem[];
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onReloadMediaItemsByViewSpec: () => any;
  onFetchManifest: (mediaItemId: string) => Promise<MediaManifest>; // your controller returns manifest
}

const assetUrlFor = (mediaItemId: string, mediaItem: MediaItem, variant: ViewVariant): string => {
  if (variant === 'original') {
    return mediaItem.url!;
  } else if (variant === 'preferred') {
    const mediaItemId: string = mediaItem.preferredDerivativeId ? mediaItem.preferredDerivativeId : mediaItem.uniqueId;
    const derivative: Derivative | undefined = mediaItem.derivatives.find(d => d.derivativeId === mediaItemId);
    if (derivative) {
      return derivative.url!;
    } else {
      return getPhotoUrl(mediaItem);
    }
  } else {
    const derivative: Derivative | undefined = mediaItem.derivatives.find(d => d.derivativeId === variant.id);
    if (derivative) {
      return derivative.url!;
    } else {
      return getPhotoUrl(mediaItem);
    }
  }
};

const LoupeViewController = (props: LoupeViewControllerProps) => {
  const { loupeViewMediaItemId, mediaItems } = props;

  // Local state for manifest + current variant selection
  const [manifest, setManifest] = React.useState<MediaManifest | null>(null);
  const [variant, setVariant] = React.useState<ViewVariant>('preferred');
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

  // When current media changes → fetch manifest and reset selection
  React.useEffect(() => {
    let cancelled = false;

    if (loupeViewMediaItemId) {
      props.onFetchManifest(loupeViewMediaItemId)
        .then((m) => {
          if (cancelled) return;
          setManifest(m);
          setVariant('preferred'); // default view
        })
        .catch(() => setManifest(null));
    } else {
      setManifest(null);
    }

    return () => { cancelled = true; };
  }, [loupeViewMediaItemId]);

  // Recompute image URL whenever media, variant, or manifest changes
  React.useEffect(() => {
    if (!loupeViewMediaItemId) return;

    // optional cache-bust using current media's lastModified (matches existing LoupeView UX)
    const currentMedia: MediaItem | undefined = mediaItems.find(m => m.uniqueId === loupeViewMediaItemId);

    const base = assetUrlFor(loupeViewMediaItemId, currentMedia!, variant);
    // const cacheBust = currentMedia?.lastModified ? `&v=${encodeURIComponent(currentMedia.lastModified as any)}` : '';
    // setImgSrc(`${base}${cacheBust}`);
    setImgSrc(base);
  }, [loupeViewMediaItemId, variant, manifest, mediaItems]);

  // Keyboard nav remains as you had it (Left/Right/Delete). Add O/P/1..9 (optional)
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'o': case 'O': setVariant('original'); break;
        case 'p': case 'P': setVariant('preferred'); break;
        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9':
          if (manifest?.derivatives[(+event.key) - 1]) {
            setVariant({ kind: 'derivative', id: manifest.derivatives[(+event.key) - 1].derivativeId });
          }
          break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [manifest]);

  // Your existing Left/Right/Delete effect unchanged…

  // Render
  return (
    <LoupeView
      imgSrcOverride={imgSrc}
      header={
        <LoupeVariantHeaderSwitch
          manifest={manifest}
          value={variant}
          onChange={(next) => setVariant(next)}
        />
      }
    />
  );
};

function mapStateToProps(state: any) {
  return {
    loupeViewMediaItemId: getLoupeViewMediaItemId(state),
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    mediaItems: getMediaItems(state),
  };
}

const xmapDispatchToProps = (dispatch: TedTaggerDispatch) =>
  bindActionCreators(
    {
      onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
      onSetPhotoState: setPhotoState,
      onReloadMediaItemsByViewSpec: loadAndReplaceMediaItemsByViewSpec,
      onFetchManifest: fetchManifest,
    },
    dispatch
  );

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => ({
  // regular actions can stay simple
  onSetLoupeViewMediaItemId: (id: string) => dispatch(setLoupeViewMediaItemIdRedux(id)),
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) =>
    dispatch(setPhotoState(mediaItemIds, photoState)),
  onReloadMediaItemsByViewSpec: () => dispatch(loadAndReplaceMediaItemsByViewSpec()),

  // IMPORTANT: wrap the thunk to return a Promise<MediaManifest>
  onFetchManifest: (mediaItemId: string) =>
    (dispatch(fetchManifest(mediaItemId) as any) as unknown as Promise<MediaManifest>),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoupeViewController);
