import { styled } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { keyframes } from "@emotion/react";

const gradientAnimation = keyframes`
  0% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
`;

export const StyledLinearProgress = styled(LinearProgress)`
  height: 4px;
  border-radius: 2px;
  overflow: hidden;

  &.MuiLinearProgress-root {
    background: linear-gradient(
      45deg,
      rgba(255, 0, 150, 0.8),
      rgba(0, 206, 209, 0.8),
      rgba(255, 165, 0, 0.8)
    );
    background-size: 300% 300%;
    animation: ${gradientAnimation} 3s infinite;
  }

  & .MuiLinearProgress-bar {
    background: transparent;
    box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.8);
  }
`;
