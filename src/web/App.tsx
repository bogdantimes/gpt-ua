import * as React from "react";
import {useEffect, useState} from "react";
import {
  Alert,
  Box,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  LinearProgress,
  Link,
  Stack,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {GitHub, Instagram, Twitter,} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import Answer from "./Answer";
import Prompt from "./Prompt";
import {ConversationElem, PromptElem} from "./Types";
import DonateButton from "./DonateButton";

export default function App(): JSX.Element {
  const {t, i18n} = useTranslation("translation");
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const theme = React.useMemo(
    () => createTheme({palette: {mode: mode ? `dark` : `light`}}),
    [mode]
  );

  const [error, setError] = useState<null | string>("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState<number | null>(null);
  const [lastRequestCost, setLastRequestCost] = useState(0);
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
  };

  // initiate lang using the browser's language
  React.useEffect(() => {
    const browserLang = navigator?.language?.split("-")[0] || "en";
    changeLanguage(browserLang);
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
          const originalAnswer = gptReply?.choices?.[0]?.message.content.trim() ?? "";
          const lastPrompt = conversation.filter((elem) => elem.isUser).pop();
          if (lastPrompt) {
            lastPrompt.answered = true;
          }
          setConversation((conversation: ConversationElem[]) => {

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
                  elem={elem}
                />
            );
          })}
          {loading && <LinearProgress/>}
          {error && <Alert severity="error">{error}</Alert>}
          {moneyLeft !== null && isFinite(moneyLeft) && (
            <Alert severity={moneyLeft <= 0.5 ? "warning" : "info"}>
              <Typography marginBottom={"10px"}>{t('budget.donate')}</Typography>
              <Box id="donate-button-container" paddingRight={"30px"} display={"table"} marginLeft={"auto"} marginRight={"auto"}>
                <DonateButton/>
              </Box>
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
      </Container>
    </ThemeProvider>
  );
}

interface Message {
  id: number;
  lang: string;
  original: string;
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
