import * as React from "react";
import {useState} from "react";
import {
  Alert,
  Box,
  Card,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import {GitHub, Instagram, Send, Twitter} from "@mui/icons-material";

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

  // initiate lang using the browser's language
  React.useEffect(() => {
    const browserLang = navigator?.language?.split("-")[0];
    // if the browser's language is not supported, use 'uk' as default
    // supported langs are 'uk', 'ru' and 'en'.
    const supportedLangs = ["uk", "ru", "en"];
    if (supportedLangs.includes(browserLang)) {
      setLang(browserLang);
    } else {
      setLang("uk");
    }
  }, []);

  const handleSend = () => {
    setAnswer("");
    setError("");

    if (prompt.length <= 5) {
      const langToLabel = {
        en: "Please, ask a more detailed question",
        uk: "Будь ласка, задайте більш детальний запит",
        ru: "Пожалуйста, задайте более детальный запрос",
      }
      setError(langToLabel[lang]);
      return;
    }

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
      })
      .catch((err) => {
        console.log(err);
        setError(err?.error || err?.answer || JSON.stringify(err));
        if (isFinite(+(err?.moneyLeft))) {
          setMoneyLeft(+err.moneyLeft);
          setLastRequestCost(0);
        }
      })
      .finally(() => setLoading(false));
  };

  const langToLabel = {
    en: "Ask me anything",
    uk: "Задай мені будь-що",
    ru: "Задай мне что угодно",
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="sm" sx={{padding: 2}}>
        <Stack spacing={2}>
          {/* center aligned GPT-UA */}
          <Box sx={{padding: 2, textAlign: "center"}}>
            <h1>GPT-UA</h1>
          </Box>
          <Select
            value={lang}
            onChange={(event) => setLang(event.target.value)}
          >
            <MenuItem value="en">English (original)</MenuItem>
            <MenuItem value="uk">Українська (з перекладом)</MenuItem>
            <MenuItem value="ru">Русский (с переводом)</MenuItem>
          </Select>
          <FormControl>
            <InputLabel htmlFor="prompt">{langToLabel[lang]}</InputLabel>
            <OutlinedInput
              id="prompt"
              label={langToLabel[lang]}
              value={prompt}
              multiline
              onChange={handlePromptChange}
              onKeyDown={(event) => {
                if (event.ctrlKey && event.key === "Enter") {
                  handleSend();
                }
              }}
              endAdornment={
                <IconButton onClick={handleSend} disabled={loading || prompt.length === 0}>
                  <Send/>
                </IconButton>
              }
            />
            <FormHelperText>Ctrl+Enter</FormHelperText>
          </FormControl>
          {loading && <LinearProgress/>}
          {error && <Alert severity="error">{error}</Alert>}
          {answer.length > 0 && <Card sx={{padding: 2, overflowX: "auto"}}>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </Card>}
          {moneyLeft >= 0 && (
            <Alert severity="info">
              {lang === "uk" &&
                <>
                  Цей запит коштував: ${lastRequestCost.toFixed(4)}<br/>
                  Грошей в проекті залишилось: ${moneyLeft.toFixed(2)}<br/>
                  Додати до загального бюджету:{" "}
                </>
              }
              {lang === "en" &&
                <>
                  This request cost: ${lastRequestCost.toFixed(4)}<br/>
                  Remaining project budget: ${moneyLeft.toFixed(2)}<br/>
                  Top-up the shared budget:{" "}
                </>
              }
              {lang === "ru" &&
                <>
                  Этот запрос стоил: ${lastRequestCost.toFixed(4)}<br/>
                  Денег в проекте осталось: ${moneyLeft.toFixed(2)}<br/>
                  Добавить в общий бюджет:{" "}
                </>
              }
              <Link href="https://paypal.me/BohdanKovalov" target="_blank">PayPal</Link>{" | "}
              <Link href="https://patreon.com/bogdantimes" target="_blank">Patreon</Link>{" | "}
              <Link href="https://send.monobank.ua/jar/3Q3K3VdHuU" target="_blank">Monobank</Link>
            </Alert>
          )}
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Link href="https://github.com/bogdantimes" target="_blank">
                <GitHub/>
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://twitter.com/bogdantimes" target="_blank">
                <Twitter/>
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://www.instagram.com/bogdantimes" target="_blank">
                <Instagram/>
              </Link>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
