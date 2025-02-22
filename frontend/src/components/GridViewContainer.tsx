import * as React from 'react';
import { MediaItem } from '../types';
import GridView from './GridView';
import TooltipOverlay from './TooltipOverlay';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[],
  numGridColumns: number;
}

const GridViewContainer = (props: any) => {
  const [tooltip, setTooltip] = React.useState<{ text: string; position: { top: number; left: number } } | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <GridView {...props} setTooltip={setTooltip} />
      <TooltipOverlay tooltip={tooltip} />
    </div>
  );
};

export default GridViewContainer;
