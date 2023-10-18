import { styled } from "@mui/system";
import { LinearProgress } from "@mui/material";

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "15px",
  borderRadius: "10px",
  background: "linear-gradient(90deg, #B2DFDB, #E0F7FA)", // Calm teal gradient background
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 0 10px rgba(178, 223, 219, 0.3)", // Soft ambient glow

  "& .MuiLinearProgress-bar": {
    borderRadius: "10px",
    background: "linear-gradient(45deg, #4FC3F7 30%, #81D4FA 90%)", // Gentle blue gradient
    transition: "width 1s ease-in-out",
    animation: "pulse 2s infinite alternate", // Subtle pulsing effect
  },

  "&:before": {
    // Soft shimmer effect
    content: '""',
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
    transform: "translateX(-100%)",
    animation: "shimmer 2s infinite",
  },

  "@keyframes shimmer": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "60%": {
      transform: "translateX(100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },

  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 5px rgba(77, 195, 247, 0.5)", // Soft blue glow
    },
    "100%": {
      boxShadow: "0 0 10px rgba(129, 212, 250, 0.5)", // Lighter blue glow
    },
  },
}));
