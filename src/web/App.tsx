import * as React from "react";
import {useState} from "react";
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
import {Send} from "@mui/icons-material";

const gasURL = `https://script.google.com/macros/s/AKfycbxTxPG_EdYlm0IeRodTswSlBPpZ1cW_VDD3A_tgi5TrvGkbKbNHkRt0rvpY_4KBWkuSTA/exec`;

export default function App(): JSX.Element {
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const theme = React.useMemo(
    () => createTheme({palette: {mode: mode ? `dark` : `light`}}),
    [mode]
  );

  const [prompt, setPrompt] = useState("");
  const [lang, setLang] = useState("uk");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState(-1);
  const [lastRequestCost, setLastRequestCost] = useState(-1);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSend = () => {
    setLoading(true);
    const serviceURL = "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws"
    const url = `${serviceURL}?prompt=${encodeURI(prompt)}&lang=${lang}`;
    // set the request's mode to 'no-cors' to fetch the resource with CORS disabled
    fetch(url)
      .then((response) => response.json())
      .then((gptReply) => {
        console.log(gptReply);
        setAnswer(gptReply.answer);
        setMoneyLeft(+gptReply.moneyLeft);
        setLastRequestCost(+gptReply.cost);
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
      <CssBaseline/>
      <Card>
        <Stack spacing={2}>
          <Select
            value={lang}
            onChange={(event) => setLang(event.target.value)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="uk">Українська</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
          </Select>
          <Input
            value={prompt}
            onChange={handlePromptChange}
            placeholder={lang === "en" ? "Ask me anything" : lang === "uk" ? "Задай мені будь-що" : "Спроси меня что угодно"}
          />
          <IconButton onClick={handleSend}>
            <Send/>
          </IconButton>
          <ReactMarkdown>{answer}</ReactMarkdown>
          {loading && <Alert severity="info">Loading...</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {moneyLeft >= 0 && (
            <Alert severity="info">
              {lang === "uk" &&
                <>
                  Цей запит коштував: ${lastRequestCost.toFixed(4)}. У мене залишилось ${moneyLeft.toFixed(2)}.
                  Донат:{" "}
                </>
              }
              {lang === "en" &&
                <>
                  This request cost: ${lastRequestCost.toFixed(4)}. I have left ${moneyLeft.toFixed(2)}.
                  Donate:{" "}
                </>
              }
              {lang === "ru" &&
                <>
                  Этот запрос стоил: ${lastRequestCost.toFixed(4)}. У меня осталось ${moneyLeft.toFixed(2)}.
                  Донат:{" "}
                </>
              }
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
