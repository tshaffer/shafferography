import React from 'react';
import { Tooltip } from '@mui/material';

export interface GlobalTooltipProps {
  tooltip: { text: string; position: { top: number; left: number } } | null;
}

const GlobalTooltip = ({ tooltip }: GlobalTooltipProps) => {
  return (
    <Tooltip open={!!tooltip} title={tooltip?.text || ''} placement="top">
      <div
        style={{
          position: 'absolute',
          top: tooltip?.position.top ?? -9999, // Hide when not active
          left: tooltip?.position.left ?? -9999,
          width: 1,
          height: 1,
        }}
      />
    </Tooltip>
  );
};

export default GlobalTooltip;
