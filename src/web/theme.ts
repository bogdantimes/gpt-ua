import { createTheme } from "@mui/material/styles";

const cyberpunkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ffff",
    },
    secondary: {
      main: "#ff00ff",
    },
    background: {
      default: "#2a2a2a", // Adjust this value for a slightly lighter background
      paper: "#333",
    },
    text: {
      primary: "#00ffff",
      secondary: "#ff00ff",
    },
  },
  typography: {
    fontFamily: "'Orbitron', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://wallpaperaccess.com/download/cyberpunk-style-5127290");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      `,
    },
  },
});

export default cyberpunkTheme;
