import { Tooltip } from '@mui/material';

export interface GlobalTooltipProps {
  tooltip: { text: string; position: { top: number; left: number } } | null;
}

const GlobalTooltip = ({ tooltip }: GlobalTooltipProps) => {
  return (
    <Tooltip open={!!tooltip} title={tooltip?.text || ''} placement="top">
      <div
        style={{
          position: 'fixed', // Use fixed so it stays consistent on scroll
          top: tooltip?.position.top ?? -9999,
          left: tooltip?.position.left ?? -9999,
          width: 1,
          height: 1,
          pointerEvents: 'none', // Prevent blocking interactions
        }}
      />
    </Tooltip>
  );
};

export default GlobalTooltip;
