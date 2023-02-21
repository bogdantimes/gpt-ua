import * as React from "react";
import {useEffect, useState} from "react";
import {
  Alert,
  Box,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Modal,
  Select,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import {GitHub, Instagram, Twitter,} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import Answer from "./Answer";
import Prompt from "./Prompt";
import {ConversationElem, PromptElem} from "./Types";
// @ts-ignore
import binanceQR from "./img/binanceQR.png"

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
    label: "Any (English is better)",
  },
];

export default function App(): JSX.Element {
  const {t, i18n} = useTranslation("translation");
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const theme = React.useMemo(
    () => createTheme({palette: {mode: mode ? `dark` : `light`}}),
    [mode]
  );

  const [error, setError] = useState<null | string>("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState(-1);
  const [lastRequestCost, setLastRequestCost] = useState(-1);
  const [conversation, setConversation] = useState<ConversationElem[]>(conversationLoader);
  useEffect(() => {
    try {
      localStorage.setItem('gpt_conversation', JSON.stringify(conversation));
    } catch (e) {
    }
  }, [conversation]);

  const lang = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem('gpt_lang', lng);
    } catch (e) {
    }
  };

  // initiate lang using the browser's language
  React.useEffect(() => {
    // try get the language from the storage
    try {
      const storedLang = localStorage.getItem('gpt_lang');
      if (storedLang) {
        changeLanguage(storedLang);
        return;
      }
    } catch (e) {
    }

    const browserLang = navigator?.language?.split("-")[0];
    // if the browser's language is not supported, use 'en' as default
    // supported langs are 'uk', 'ru' and 'en'.
    if (SUPPORTED_LANGS.find((lang) => lang.name === browserLang)) {
      changeLanguage(browserLang);
    } else {
      changeLanguage("en"); // Any (aka English) by default
    }
  }, []);

  const handleSend = (el: PromptElem) => {
    setError("");

    if (el.getText().length <= 1) {
      setError(t('errors.notEnoughDetails'));
      return;
    }

    // if el is start prompt, then clear the conversation
    if (el.getId() === 0) {
      conversation.splice(0);
      conversation.push(ConversationElem.newPrompt(0, el.getText()));
      setConversation(conversation);
    }

    const messages = buildMessaages(conversation, lang);

    setLoading(true);
    const serviceURL = "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws"
    fetch(serviceURL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messages}),
    })
      .then((response) => {
        return response.text().then((text) => {
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(text);
          }
        });
      })
      .then((gptReply) => {
        console.log(gptReply);
        if (gptReply?.error) {
          setError(gptReply?.answer || gptReply?.error);
        } else {
          const answer = gptReply?.answer ?? "";
          const originalAnswer = gptReply?.choices?.[0]?.text.trim() ?? "";
          const lastPrompt = conversation.filter((elem) => elem.isUser).pop();
          if (lastPrompt) {
            lastPrompt.answered = true;
          }
          setConversation((conversation: ConversationElem[]) => {

            // Apply free translations
            gptReply?.translatedMessages?.forEach((msg: Message) => {
              let el = conversation.find((elem) => elem.getId() === msg.id);
              if (el) {
                el.originalText = msg.en || "";
              }
            })

            const newConv = [
              ...conversation,
              ConversationElem.newAnswer(conversation.length, answer, originalAnswer),
              ConversationElem.newPrompt(conversation.length + 1, ""),
            ];
            // Mark dropped messages
            const lastDroppedMessageId = gptReply.lastDroppedMessageId ?? -1;
            if (lastDroppedMessageId >= 0) {
              newConv.forEach(el => {
                el.dropped = el.id <= lastDroppedMessageId
              })
            }
            return newConv
          });
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

  const [binancePayOpen, setBinancePayOpen] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="sm" sx={{padding: 2}}>
        <Stack spacing={2}>
          {/* center aligned GPT-UA */}
          <Box sx={{padding: 2, textAlign: "center", position: "relative"}}>
            <h1>GPT-UA</h1>
            <p style={{marginLeft: "105px", marginTop: "-38px", marginBottom: 0, padding: 0}}>chat</p>
          </Box>
          <FormControl>
            <InputLabel id="lang">{t('language')}</InputLabel>
            <Select
              label={t('language')}
              value={lang}
              onChange={(event) => changeLanguage(event.target.value)}
            >
              {SUPPORTED_LANGS.map((lang) => <MenuItem key={lang.name} value={lang.name}>{lang.label}</MenuItem>)}
            </Select>
          </FormControl>
          {conversation.map((elem, i) => {
            return (
              elem.isUser ?
                <Prompt
                  key={`${i}_${elem.text.length}`}
                  elem={elem}
                  onClickSend={handleSend}
                  onClear={() => {
                    setConversation([ConversationElem.newPrompt(0, "")]);
                  }}
                  showClear={conversation.length > 1}
                  sendDisabled={loading}
                /> :
                <Answer
                  key={i}
                  lang={lang}
                  elem={elem}
                />
            );
          })}
          {loading && <LinearProgress/>}
          {error && <Alert severity="error">{error}</Alert>}
          {moneyLeft >= 0 && (
            <Alert severity="info">
              {
                <>
                  {t('budget.spent', {amount: lastRequestCost.toFixed(4)})}<br/>
                  {t('budget.remainingFunds', {amount: moneyLeft.toFixed(2)})}<br/>
                  {t('budget.increase')}{" "}
                </>
              }
              <Link href="https://patreon.com/bogdantimes" target="_blank">Patreon</Link>{" | "}
              <Link href="https://send.monobank.ua/jar/3Q3K3VdHuU" target="_blank">Monobank</Link>{" | "}
              <Link onClick={() => setBinancePayOpen(true)}>Binance Pay</Link>
            </Alert>
          )}
          <Grid container justifyContent="center" spacing={2} paddingRight={"30px"}>
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
          {/*  Link to check OpenAI service status */}
          <Box sx={{textAlign: "center"}}>
            <span style={{fontSize: "12px"}}>{t(`openai.slowResponse`)}</span> <Link href="https://status.openai.com/"
                                                                                     target="_blank"
                                                                                     style={{fontSize: "12px"}}>
            OpenAI status
          </Link>
          </Box>
        </Stack>
        <Modal
          open={!!binancePayOpen}
          onClose={() => setBinancePayOpen(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <img src={binanceQR} height={400} alt="Binance Pay QR Code"/>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}

interface Message {
  id: number;
  lang: string;
  original: string;
  en?: string;
  isUser: boolean;
}

function buildMessaages(conversation: ConversationElem[], lang: string): Message[] {
  const messages: Message[] = [];
  for (const elem of conversation) {
    if (elem.dropped) continue
    messages.push({
      lang,
      id: elem.getId(),
      original: elem.getText(),
      en: elem.getOriginalText(),
      isUser: elem.isUser,
    });
  }
  return messages;
}

const conversationLoader = () => {
  try {
    const c = localStorage.getItem('gpt_conversation');
    if (c) {
      const convArr = JSON.parse(c) as ConversationElem[];
      return convArr.map(e => {
        return Object.assign(new ConversationElem(), e, {staticMode: true});
      })
    } else {
      return [ConversationElem.newPrompt(0, "")]
    }
  } catch (e) {
    return [ConversationElem.newPrompt(0, "")]
  }
};
