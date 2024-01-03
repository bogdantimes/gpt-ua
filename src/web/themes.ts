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
        },
      },
    },
  },
});

// Base colors
const primaryColor = {
  light: "#6200ea",
  dark: "#bb86fc",
};
const secondaryColor = {
  light: "#03dac6",
  dark: "#03dac6",
};
const errorColor = {
  light: "#b00020",
  dark: "#cf6679",
};
const warningColor = {
  light: "#ffab00",
  dark: "#ffab00",
};
const infoColor = {
  light: "#2196f3",
  dark: "#2196f3",
};
const successColor = {
  light: "#00c853",
  dark: "#00c853",
};

// Light mode palette
const lightPalette = {
  mode: "light",
  primary: {
    main: primaryColor.light,
  },
  secondary: {
    main: secondaryColor.light,
  },
  error: {
    main: errorColor.light,
  },
  warning: {
    main: warningColor.light,
  },
  info: {
    main: infoColor.light,
  },
  success: {
    main: successColor.light,
  },
};

// Dark mode palette
const darkPalette = {
  mode: "dark",
  primary: {
    main: primaryColor.dark,
    contrastText: "#ffffff", // Ensure text on primary color is readable
  },
  secondary: {
    main: secondaryColor.dark,
    contrastText: "#000000", // Ensure text on secondary color is readable
  },
  error: {
    main: errorColor.dark,
  },
  warning: {
    main: warningColor.dark,
  },
  info: {
    main: infoColor.dark,
  },
  success: {
    main: successColor.dark,
  },
};

const lightComponentStyles = {
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: "12px", // MD3 uses more rounded corners
        padding: "6px 16px",
        elevation: 1, // Add slight elevation for depth
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        padding: "0 12px", // Slightly increase padding for better touch targets
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "16px", // Increase rounding for buttons
        padding: "8px 20px", // Increase padding to follow MD3 touch target guidelines
        textTransform: "none", // MD3 prefers buttons without uppercase transformation
        fontWeight: 500, // Adjust font weight for better readability
      },
    },
  },
  MuiButtonGroup: {
    styleOverrides: {
      grouped: {
        borderRadius: "16px", // Increase rounding to match individual buttons
        margin: "4px", // Add margin to separate buttons visually
        borderRightColor: "inherit",
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px", // Rounded corners for icon buttons
        padding: "12px", // Increase padding to meet MD3 touch target size
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "16px", // More rounded text fields as per MD3
        // Implement filled style with MD3-like background
        "& .MuiFilledInput-root": {
          backgroundColor: "rgba(0, 0, 0, 0.04)", // subtle background for light mode
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)", // darken on hover
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(0, 0, 0, 0.12)", // further darken when focused
          },
        },
      },
    },
  },
};

// Component styles for dark mode (adjust accordingly)
const darkComponentStyles = {
  ...lightComponentStyles,
  MuiTextField: {
    styleOverrides: {
      root: {
        // Implement filled style with MD3-like background for dark mode
        "& .MuiFilledInput-root": {
          backgroundColor: "rgba(255, 255, 255, 0.08)", // subtle background for dark mode
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)", // lighten on hover
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.16)", // further lighten when focused
          },
        },
      },
    },
  },
};

// Create light and dark themes
export const lightTheme = createTheme({
  palette: lightPalette,
  components: lightComponentStyles,
});
export const darkTheme = createTheme({
  palette: darkPalette,
  components: darkComponentStyles,
});
