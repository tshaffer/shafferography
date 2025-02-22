const TooltipOverlay = ({ tooltip }: { tooltip: { text: string; position: { top: number; left: number } } | null }) => {
  if (!tooltip) return null;

  return (
    <div
      style={{
        position: 'fixed', // Fix position so tooltip doesn't move on scroll
        top: tooltip.position.top ?? -9999, // Default off-screen if not active
        left: tooltip.position.left ?? -9999,
        transform: 'translate(-50%, -100%)', // Position above cursor
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Match MUI Tooltip styling
        color: '#fff',
        padding: '6px 8px',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        pointerEvents: 'none', // Ensure it doesn't interfere with user interaction
        zIndex: 1300, // Keep tooltip above other UI elements
      }}
    >
      {tooltip.text}
    </div>
  );
};

export default TooltipOverlay;
