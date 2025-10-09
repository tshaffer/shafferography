// LoupeViewController.tsx
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoupeView from './LoupeView';
import { setPhotoState, loadAndReplaceMediaItemsByViewSpec, fetchManifest } from '../controllers';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux } from '../models';
import { getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getMediaItems } from '../selectors';
import { Derivative, MediaItem, MediaManifest, PhotoState, ViewVariant } from '../types';
import { LoupeVariantHeaderSwitch } from './LoupeVariantHeaderSwitch';
import { getPhotoUrl } from '../utilities';

// NEW: thunk to persist preferred image (implement in ../controllers)
import { persistPreferredVariant } from '../controllers'; // <-- you provide this thunk

export interface LoupeViewControllerProps {
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  mediaItems: MediaItem[];
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onReloadMediaItemsByViewSpec: () => any;
  onFetchManifest: (mediaItemId: string) => Promise<MediaManifest>;
  onPersistPreferredVariant: (
    mediaItemId: string,
    payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
  ) => Promise<void>;
}

const assetUrlFor = (mediaItemId: string, mediaItem: MediaItem, variant: ViewVariant): string => {
  if (variant === 'original') {
    return mediaItem.url!;
  } else if (variant === 'preferred') {
    const preferredId: string = mediaItem.preferredDerivativeId ? mediaItem.preferredDerivativeId : mediaItem.uniqueId;
    const derivative: Derivative | undefined = mediaItem.derivatives.find(d => d.derivativeId === preferredId);
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
      props
        .onFetchManifest(loupeViewMediaItemId)
        .then((m) => {
          if (cancelled) return;
          setManifest(m);
          setVariant('preferred'); // default view on media change
        })
        .catch(() => setManifest(null));
    } else {
      setManifest(null);
    }

    return () => {
      cancelled = true;
    };
  }, [loupeViewMediaItemId]);

  // Compute current media
  const currentMedia: MediaItem | undefined = React.useMemo(
    () => mediaItems.find((m) => m.uniqueId === loupeViewMediaItemId),
    [mediaItems, loupeViewMediaItemId]
  );

  // Recompute image URL whenever media, variant, or manifest changes
  React.useEffect(() => {
    if (!loupeViewMediaItemId || !currentMedia) return;

    console.log('Recomputing imgSrc for variant', variant);

    const base = assetUrlFor(loupeViewMediaItemId, currentMedia, variant);
    console.log('Computed base URL:', base);
    setImgSrc(base);
  }, [loupeViewMediaItemId, variant, manifest, mediaItems, currentMedia]);

  // Keyboard nav additions: O/P/1..9 (derivative quick select)
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'o':
        case 'O':
          setVariant('original');
          break;
        case 'p':
        case 'P':
          setVariant('preferred');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (manifest?.derivatives[(+event.key) - 1]) {
            setVariant({ kind: 'derivative', id: manifest.derivatives[(+event.key) - 1].derivativeId });
          }
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [manifest]);

  // Helper: choose first derivative when the user clicks the Derivative toggle with none selected
  const selectFirstDerivative = React.useCallback(() => {
    if (!manifest || manifest.derivatives.length === 0) return;
    const firstId = manifest.derivatives[0].derivativeId;
    setVariant({ kind: 'derivative', id: firstId });
  }, [manifest]);

  // Explicit persist action: Set the currently visible variant as preferred
  const handleSetAsPreferred = React.useCallback(async () => {
    if (!loupeViewMediaItemId || !currentMedia) return;

    if (variant === 'original') {
      // Persist "original" as preferred → convention: clear preferredDerivativeId server-side
      await props.onPersistPreferredVariant(loupeViewMediaItemId, { kind: 'original' });
    } else if (typeof variant === 'object' && variant.kind === 'derivative') {
      await props.onPersistPreferredVariant(loupeViewMediaItemId, {
        kind: 'derivative',
        derivativeId: variant.id,
      });
    } else {
      // variant === 'preferred' → persist whatever the effective preferred currently is
      const effectiveId = currentMedia.preferredDerivativeId;
      if (effectiveId) {
        await props.onPersistPreferredVariant(loupeViewMediaItemId, {
          kind: 'derivative',
          derivativeId: effectiveId,
        });
      } else {
        await props.onPersistPreferredVariant(loupeViewMediaItemId, { kind: 'original' });
      }
    }

    // After persisting, you might want to refresh currentMedia from server or optimistically update Redux.
    // If your persistPreferredVariant thunk updates the store, nothing else is needed here.
    // Otherwise, consider re-fetching manifest or media metadata if the backend changes anything visible.
  }, [loupeViewMediaItemId, currentMedia, variant, props]);

  return (
    <LoupeView
      imgSrcOverride={imgSrc}
      header={
        <LoupeVariantHeaderSwitch
          manifest={manifest}
          viewVariant={variant}
          onSetVariant={(next) => setVariant(next)}
          onSetAsPreferred={handleSetAsPreferred}
          onRequestSelectFirstDerivative={selectFirstDerivative}
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

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => ({
  onSetLoupeViewMediaItemId: (id: string) => dispatch(setLoupeViewMediaItemIdRedux(id)),
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) =>
    dispatch(setPhotoState(mediaItemIds, photoState)),
  onReloadMediaItemsByViewSpec: () => dispatch(loadAndReplaceMediaItemsByViewSpec()),

  // Wrap the thunk to return a Promise<MediaManifest>
  onFetchManifest: (mediaItemId: string) =>
    (dispatch(fetchManifest(mediaItemId) as any) as unknown as Promise<MediaManifest>),

  // NEW: Persist preferred image (Original or a specific Derivative)
  onPersistPreferredVariant: (
    mediaItemId: string,
    payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
  ) => (dispatch(persistPreferredVariant(mediaItemId, payload) as any) as unknown as Promise<void>),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoupeViewController);
