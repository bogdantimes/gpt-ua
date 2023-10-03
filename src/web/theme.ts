import { createTheme } from "@mui/material/styles";

const cyberpunkTheme = createTheme({
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

export default cyberpunkTheme;
