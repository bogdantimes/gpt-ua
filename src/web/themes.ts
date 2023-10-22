import { createTheme } from "@mui/material/styles";

export const cyberpunkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ffff",
      light: "#33ffff",
      dark: "#00cccc",
    },
    secondary: {
      main: "#ff00ff",
      light: "#ff33ff",
      dark: "#cc00cc",
    },
    background: {
      default: "#1a1a1a",
      paper: "#222",
    },
    text: {
      primary: "#00ffff",
      secondary: "#ff00ff",
    },
  },
  typography: {
    fontFamily: "Tomorrow, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("https://pbs.twimg.com/media/Ft2dHReWYAAr3qq?format=jpg&name=4096x4096");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: "1px solid #00ffff",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          border: "1px solid #00ffff",
          boxShadow: "0 0 10px #00ffff",
        },
      },
    },
  },
});

export const personalTheme = createTheme({
  palette: {
    mode: "light", // always in light mode
    primary: {
      main: "#ff4757", // vibrant red
      light: "#ff6b81",
      dark: "#e04050",
    },
    secondary: {
      main: "#1e90ff", // vibrant blue
      light: "#3aa2ff",
      dark: "#0074d9",
    },
    background: {
      default: "#f5f5f5", // light gray
      paper: "#ffffff", // white
    },
    text: {
      primary: "#333333", // almost black
      secondary: "#555555", // gray
    },
  },
  typography: {
    fontFamily: "Tomorrow, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: linear-gradient(to bottom, #A6E3E9, #FFC1E3);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: "1px solid #ff4757",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 0 10px #ff4757, 0 0 20px #ff4757",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          border: "1px solid #ff4757",
          boxShadow: "0 0 10px #ff4757",
        },
      },
    },
  },
});
