// IconButtonRow.tsx
import React from "react";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

type IconButtonState = "active" | "available" | "disabled";

interface PhotoLayoutIconButtonProps {
  icon: React.ReactNode;
  state: IconButtonState;
  onClick?: () => void;
}

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "state",
})<{ state: IconButtonState }>(({ theme, state }) => ({
  color:
    state === "active"
      ? theme.palette.primary.main
      : state === "disabled"
        ? theme.palette.action.disabled
        : theme.palette.text.primary,
  background:
    state === "active"
      ? theme.palette.action.selected
      : "none",
  opacity: state === "disabled" ? 0.5 : 1,
  pointerEvents: state === "disabled" ? "none" : "auto",
  boxShadow:
    state === "active"
      ? `0 0 0 2px ${theme.palette.primary.main}`
      : "none",
  "&:hover": {
    background:
      state === "available"
        ? theme.palette.action.hover
        : state === "active"
          ? theme.palette.action.selected
          : "none",
  },
  margin: "0 8px",
}));

const PhotoLayoutIconButton: React.FC<PhotoLayoutIconButtonProps> = ({
  icon,
  state,
  onClick,
}) => {
  console.log('PhotoLayoutIconButton: props:', state);
  return (
    <StyledIconButton
      state={state}
      disabled={state === "disabled"}
      tabIndex={state === "disabled" ? -1 : 0}
      onClick={state !== "disabled" ? onClick : undefined}
      size="large"
    >
      {icon}
    </StyledIconButton>
  )
};

export default PhotoLayoutIconButton;
