import * as React from 'react';
import GridView from './GridView';
import TooltipOverlay from './TooltipOverlay';

const GridViewContainer = () => {
  const [tooltip, setTooltip] = React.useState<{ text: string; position: { top: number; left: number } } | null>(null);
  
  return (
    <div style={{ position: 'relative' }}>
      <GridView setTooltip={setTooltip} />
      <TooltipOverlay tooltip={tooltip} />
    </div>
  );
};

export default GridViewContainer;
