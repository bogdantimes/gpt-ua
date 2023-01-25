import * as React from "react";
import { useState } from "react";
import {
  Alert,
  Card,
  createTheme,
  CssBaseline,
  IconButton,
  Input,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Send } from "@mui/icons-material";

const gasURL = `https://script.google.com/macros/s/AKfycbxTxPG_EdYlm0IeRodTswSlBPpZ1cW_VDD3A_tgi5TrvGkbKbNHkRt0rvpY_4KBWkuSTA/exec`;

export default function App(): JSX.Element {
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const theme = React.useMemo(
    () => createTheme({ palette: { mode: mode ? `dark` : `light` } }),
    [mode]
  );

  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState(-1);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSend = () => {
    setLoading(true);
    // set the request's mode to 'no-cors' to fetch the resource with CORS disabled
    fetch(gasURL, {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
      .then((response) => {
        return response.json();
      })
      .then((reply) => {
        console.log(reply);
        setAnswer(reply.answer);
        setMoneyLeft(+reply.moneyLeft);
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError(err.error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Card>
        <Stack spacing={2}>
          <Input
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Спроси у меня что-нибудь"
          />
          <IconButton onClick={handleSend}>
            <Send />
          </IconButton>
          <ReactMarkdown>{answer}</ReactMarkdown>
          {loading && <Alert severity="info">Loading...</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {moneyLeft >= 0 && (
            <Alert severity="info">
              У меня осталось ${moneyLeft.toFixed(2)}. Донат:{" "}
              <a href="https://patreon.com/bogdantimes">
                patreon.com/bogdantimes
              </a>
            </Alert>
          )}
        </Stack>
      </Card>
    </ThemeProvider>
  );
}
