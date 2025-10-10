// LoupeViewController.tsx
import * as React from 'react';
import { connect } from 'react-redux';
import LoupeView from './LoupeView';
import { setPhotoState, loadAndReplaceMediaItemsByViewSpec } from '../controllers';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setViewVariant } from '../models';
import { getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getMediaItems, getMediaManifestById } from '../selectors';
import { Derivative, MediaItem, MediaManifest, PhotoState, ViewVariant } from '../types';
import { LoupeVariantHeaderSwitch } from './LoupeVariantHeaderSwitch';
import { getMediaItemUrl, getPhotoUrl } from '../utilities';

// NEW: thunk to persist preferred image (implement in ../controllers)
import { persistPreferredVariant } from '../controllers'; // <-- you provide this thunk
import { getViewVariant } from '../selectors/mediaView';

export interface LoupeViewControllerProps {
  loupeViewMediaItemId: string;
  variant?: ViewVariant | null;
  loupeViewMediaItemIds: string[];
  mediaItems: MediaItem[];
  mediaManifest: MediaManifest | null;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) => any;
  onReloadMediaItemsByViewSpec: () => any;
  onSetViewVariant: (mediaItemId: string, variant: ViewVariant) => any;
  onPersistPreferredVariant: (
    mediaItemId: string,
    payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
  ) => Promise<void>;
}

const LoupeViewController = (props: LoupeViewControllerProps) => {
  const { loupeViewMediaItemId, mediaItems } = props;

  const [imgSrc, setImgSrc] = React.useState<string>('');

  // Compute current media
  const currentMedia: MediaItem | undefined = React.useMemo(
    () => mediaItems.find((m) => m.uniqueId === loupeViewMediaItemId),
    [mediaItems, loupeViewMediaItemId]
  );

  // Recompute image URL whenever media, variant, or manifest changes
  React.useEffect(() => {
    if (!loupeViewMediaItemId || !currentMedia) return;

    console.log('Recomputing imgSrc for variant', props.variant);

    const mediaItemUrl = getMediaItemUrl(currentMedia, props.variant!);
    console.log('Computed base URL:', mediaItemUrl);
    setImgSrc(mediaItemUrl);
  }, [loupeViewMediaItemId, props.variant, props.mediaManifest, mediaItems, currentMedia]);

  // Keyboard nav additions: O/P/1..9 (derivative quick select)
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'o':
        case 'O':
          props.onSetViewVariant(loupeViewMediaItemId, 'original');
          break;
        case 'p':
        case 'P':
          props.onSetViewVariant(loupeViewMediaItemId, 'preferred');
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
          if (props.mediaManifest?.derivatives[(+event.key) - 1]) {
            props.onSetViewVariant(loupeViewMediaItemId, { kind: 'derivative', id: props.mediaManifest.derivatives[(+event.key) - 1].derivativeId });
          }
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [props.mediaManifest]);

  // Helper: choose first derivative when the user clicks the Derivative toggle with none selected
  const selectFirstDerivative = React.useCallback(() => {
    if (!props.mediaManifest || props.mediaManifest.derivatives.length === 0) return;
    const firstId = props.mediaManifest.derivatives[0].derivativeId;
    props.onSetViewVariant(loupeViewMediaItemId, { kind: 'derivative', id: firstId });
  }, [loupeViewMediaItemId, props.mediaManifest]);

  // Explicit persist action: Set the currently visible variant as preferred
  const handleSetAsPreferred = React.useCallback(async () => {
    if (!loupeViewMediaItemId || !currentMedia) return;

    if (props.variant === 'original') {
      // Persist "original" as preferred → convention: clear preferredDerivativeId server-side
      await props.onPersistPreferredVariant(loupeViewMediaItemId, { kind: 'original' });
    } else if (typeof props.variant === 'object' && props.variant!.kind === 'derivative') {
      await props.onPersistPreferredVariant(loupeViewMediaItemId, {
        kind: 'derivative',
        derivativeId: props.variant!.id,
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
  }, [loupeViewMediaItemId, currentMedia, props.variant, props]);

  return (
    <LoupeView
      mediaItemUrl={imgSrc}
      header={
        <LoupeVariantHeaderSwitch
          manifest={props.mediaManifest}
          viewVariant={props.variant ? props.variant : 'preferred'}
          onSetVariant={(next) => props.onSetViewVariant(loupeViewMediaItemId, next)}
          onSetAsPreferred={handleSetAsPreferred}
          onRequestSelectFirstDerivative={selectFirstDerivative}
        />
      }
    />
  );
};

function mapStateToProps(state: any) {
  const loupeViewMediaItemId: string = getLoupeViewMediaItemId(state);
  return {
    loupeViewMediaItemId,
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    mediaItems: getMediaItems(state),
    variant: getViewVariant(state, loupeViewMediaItemId),
    mediaManifest: getMediaManifestById(state, loupeViewMediaItemId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => ({
  onSetLoupeViewMediaItemId: (id: string) => dispatch(setLoupeViewMediaItemIdRedux(id)),
  onSetPhotoState: (mediaItemIds: string[], photoState: PhotoState) =>
    dispatch(setPhotoState(mediaItemIds, photoState)),
  onReloadMediaItemsByViewSpec: () => dispatch(loadAndReplaceMediaItemsByViewSpec()),

  onSetViewVariant: (mediaItemId: string, variant: ViewVariant) =>
    dispatch(setViewVariant(mediaItemId, variant)),

  // NEW: Persist preferred image (Original or a specific Derivative)
  onPersistPreferredVariant: (
    mediaItemId: string,
    payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
  ) => (dispatch(persistPreferredVariant(mediaItemId, payload) as any) as unknown as Promise<void>),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoupeViewController);
