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
      default: "#222",
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
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap');
      `,
    },
  },
});

export default cyberpunkTheme;
