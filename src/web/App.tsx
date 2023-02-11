import * as React from "react";
import {useState} from "react";
import {
  Alert,
  Box,
  Card,
  Container,
  createTheme,
  CssBaseline,
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  ThemeProvider,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import {
  GitHub,
  Instagram,
  Send,
  Twitter,
  ContentCopy,
} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

const SUPPORTED_LANGS = [
  {
    name: "uk",
    label: "Українська (з перекладом)",
  },
  {
    name: "ru",
    label: "Русский (с переводом)",
  },
  {
    name: "en",
    label: "English (original)",
  },
];

export default function App(): JSX.Element {
  const {t, i18n} = useTranslation("translation");
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const theme = React.useMemo(
    () => createTheme({palette: {mode: mode ? `dark` : `light`}}),
    [mode]
  );

  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<null | string>("");
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState(-1);
  const [lastRequestCost, setLastRequestCost] = useState(-1);

  const lang = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // initiate lang using the browser's language
  React.useEffect(() => {
    const browserLang = navigator?.language?.split("-")[0];
    // if the browser's language is not supported, use 'uk' as default
    // supported langs are 'uk', 'ru' and 'en'.
    if (SUPPORTED_LANGS.find((lang) => lang.name === browserLang)) {
      changeLanguage(browserLang);
    } else {
      changeLanguage("uk");
    }
  }, []);

  const handleSend = () => {
    setAnswer("");
    setError("");
    setShowOriginal(false);

    if (prompt.length <= 1) {
      setError(t('errors.notEnoughDetails'));
      return;
    }

    setLoading(true);
    const serviceURL = "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws"
    const url = `${serviceURL}?prompt=${encodeURI(prompt)}&lang=${lang}`;
    fetch(url)
      .then((response) => response.json())
      .then((gptReply) => {
        console.log(gptReply);
        if (gptReply?.error) {
          setError(gptReply?.answer || gptReply?.error);
        } else {
          setAnswer(gptReply?.answer ?? "");
          setOriginalAnswer(gptReply?.choices?.[0]?.text.trim() ?? "");
        }
        if (isFinite(+(gptReply?.moneyLeft))) {
          setMoneyLeft(+gptReply?.moneyLeft);
          setLastRequestCost(+gptReply?.cost || 0);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message);
      })
      .finally(() => setLoading(false));
  };

  const handleCopy = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(showOriginal ? originalAnswer : answer);
      setCbTooltipOpen(true);
      setTimeout(() => setCbTooltipOpen(false), 2000);
    } else {
      setError(t('errors.insecureContext'));
    }
  };

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
            onChange={(event) => changeLanguage(event.target.value)}
          >
            {SUPPORTED_LANGS.map((lang) => <MenuItem key={lang.name} value={lang.name}>{lang.label}</MenuItem>)}
          </Select>
          <FormControl>
            <InputLabel htmlFor="prompt">{t('input.label')}</InputLabel>
            <OutlinedInput
              id="prompt"
              label={t('input.label')}
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
          {answer.length > 0 &&
            <Card sx={{padding: 2, overflowX: "auto", position: "relative"}}>
              <Tooltip
                disableHoverListener
                open={cbTooltipOpen}
                title={t('clipboard.tooltip')}
                placement="left"
                TransitionComponent={Fade}
                TransitionProps={{timeout: 600}}>
                <IconButton onPointerDown={handleCopy} sx={{position: "absolute", bottom: 5, right: 5}}>
                  <ContentCopy/>
                </IconButton>
              </Tooltip>
              <ReactMarkdown>{showOriginal ? originalAnswer : answer}</ReactMarkdown>
              {lang !== "en" && <Link sx={{fontSize: 12, cursor: "pointer"}}
                                      onClick={() => setShowOriginal(!showOriginal)}
              >
                {showOriginal ? t('answer.showTranslation') : t('answer.showOriginal')}
              </Link>}
            </Card>}
          {moneyLeft >= 0 && (
            <Alert severity="info">
              {
                <>
                  {t('budget.spent', {amount: lastRequestCost.toFixed(4)})}<br/>
                  {t('budget.remainingFunds', {amount: moneyLeft.toFixed(2)})}<br/>
                  {t('budget.increase')}{" "}
                </>
              }
              <Link href="https://paypal.me/BohdanKovalov" target="_blank">PayPal</Link>{" | "}
              <Link href="https://patreon.com/bogdantimes" target="_blank">Patreon</Link>{" | "}
              <Link href="https://send.monobank.ua/jar/3Q3K3VdHuU" target="_blank">Monobank</Link>
            </Alert>
          )}
          <Grid container justifyContent="center" spacing={2} paddingRight={"24px"}>
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
