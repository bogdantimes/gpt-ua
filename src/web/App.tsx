import "./styles.css";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMore,
  Instagram,
  LinkedIn,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Answer from "./Answer";
import Prompt from "./Prompt";
import { ConversationElem, type PromptElem } from "./Types";
import { FundingBar } from "./FundingBar";
import cyberpunkTheme from "./theme";

export default function App(): JSX.Element {
  const { t, i18n } = useTranslation("translation");
  const mode = useMediaQuery(`(prefers-color-scheme: dark)`);

  const checkForCyberTheme = () => {
    return window.location.hash.includes("theme=cyber");
  };

  const getTheme = () => {
    if (checkForCyberTheme()) {
      return cyberpunkTheme;
    } else {
      return createTheme({ palette: { mode: mode ? `dark` : `light` } });
    }
  };

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [mode]);

  const [error, setError] = useState<null | string>("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState<number | null>(null);
  const [conversation, setConversation] =
    useState<ConversationElem[]>(conversationLoader);
  useEffect(() => {
    try {
      localStorage.setItem("gpt_conversation", JSON.stringify(conversation));
    } catch (e) {}
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

  useEffect(() => {
    const hash = window.location.hash;
    const promptMatch = /#prompt=([^&]*)/.exec(hash);
    if (promptMatch) {
      window.location.hash = "";
      const prompt = decodeURIComponent(promptMatch[1]);
      handleSend(ConversationElem.newPrompt(0, prompt));
    }
  }, []);

  function sendConversation() {
    const messages = buildMessaages(conversation, lang);
    // @ts-expect-error
    grecaptcha.enterprise
      .execute("6LemuPokAAAAAGa_RpQfdiCHbbaolQ1i3g-EvNom", { action: "login" })
      .then(function (token) {
        const serviceURL =
          "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws";
        fetch(serviceURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            v: 8,
            token,
          }),
        })
          .then(async (response) => {
            return await response.text().then((text) => {
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
              const originalAnswer =
                gptReply?.choices?.[0]?.message.content.trim() ?? "";
              const lastPrompt = conversation
                .filter((elem) => elem.isUser)
                .pop();
              if (lastPrompt) {
                lastPrompt.answered = true;
              }
              setConversation((conversation: ConversationElem[]) => {
                const newConv = [
                  ...conversation,
                  ConversationElem.newAnswer(
                    conversation.length,
                    answer,
                    originalAnswer
                  ),
                  ConversationElem.newPrompt(conversation.length + 1, ""),
                ];
                // Mark dropped messages
                const lastDroppedMessageId =
                  gptReply.lastDroppedMessageId ?? -1;
                if (lastDroppedMessageId >= 0) {
                  newConv.forEach((el) => {
                    el.dropped = el.id <= lastDroppedMessageId;
                  });
                }
                return newConv;
              });
            }
            if (isFinite(+gptReply?.moneyLeft)) {
              setMoneyLeft(+gptReply?.moneyLeft);
            }
          })
          .catch((err) => {
            console.log(err);
            setError(err?.message);
          })
          .finally(() => {
            setLoading(false);
          });
      });
  }

  const handleSend = (el: PromptElem) => {
    setError("");

    if (el.getText().length <= 1) {
      setError(t("errors.notEnoughDetails"));
      return;
    }

    // if el is start prompt, then clear the conversation
    if (el.getId() === 0) {
      conversation.splice(0);
      conversation.push(ConversationElem.newPrompt(0, el.getText()));
      setConversation(conversation);
    }

    setLoading(true);
    setTimeout(() => {
      sendConversation();
    }, new Date().getMilliseconds() * 3);
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ padding: 2 }}>
        <Stack spacing={2}>
          {/* center aligned GPT-UA */}
          <Box sx={{ padding: 2, textAlign: "center", position: "relative" }}>
            <h1>GPT-UA</h1>
            <p
              style={{
                marginLeft: "105px",
                marginTop: "-38px",
                marginBottom: 0,
                padding: 0,
              }}
            >
              chat
            </p>
          </Box>
          {conversation.map((elem, i) => {
            return elem.isUser ? (
              <Prompt
                key={`${i}_${elem.text.length}`}
                elem={elem}
                onClickSend={handleSend}
                onClear={() => {
                  setConversation([ConversationElem.newPrompt(0, "")]);
                }}
                showClear={conversation.length > 1}
                sendDisabled={loading}
              />
            ) : (
              <Answer key={i} elem={elem} />
            );
          })}
          {loading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {moneyLeft !== null && isFinite(moneyLeft) && (
            <Alert
              sx={{
                textAlign: "center",
                "& .MuiAlert-message": { width: "100%" },
              }}
              icon={false}
              severity={moneyLeft <= 1 ? "warning" : "info"}
            >
              <FundingBar target={120} value={moneyLeft}>
                <>
                  <Button
                    variant="contained"
                    size={"small"}
                    onClick={() =>
                      window.open(
                        `https://send.monobank.ua/jar/3Q3K3VdHuU`,
                        "_blank"
                      )
                    }
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "light" ? "black" : "darkgrey",
                      color: "white",
                      borderRadius: `8px`,
                      mt: "16px",
                      display: `flex`,
                      mr: `auto`,
                      ml: `auto`,
                    }}
                  >
                    {t(`budget.mono`)} (Google Pay / Visa / Mastercard)
                  </Button>
                  <Typography ml={"auto"} mr={"auto"} variant={"caption"}>
                    10₴ ≈ $0.25
                  </Typography>
                </>
              </FundingBar>
            </Alert>
          )}
          <Grid
            container
            justifyContent="center"
            spacing={2}
            paddingRight={"30px"}
          >
            <Grid item>
              <Link
                href="https://www.linkedin.com/in/bohdan-kovalov"
                target="_blank"
              >
                <LinkedIn className={`pulsating-icon-${theme.palette.mode}`} />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://twitter.com/bogdantimes" target="_blank">
                <Twitter className={`pulsating-icon-${theme.palette.mode}`} />
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="https://www.instagram.com/bogdantimes"
                target="_blank"
              >
                <Instagram className={`pulsating-icon-${theme.palette.mode}`} />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://t.me/gpt_ua_chat" target="_blank">
                <Telegram className={`pulsating-icon-${theme.palette.mode}`} />
              </Link>
            </Grid>
          </Grid>
          {theme !== cyberpunkTheme && (
            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Link
                href="https://gpt-ua.click/#theme=cyber"
                className="cyber-link"
              >
                Try the Cyber theme
              </Link>
            </Box>
          )}
          {/*  Link to check OpenAI service status */}
          <Box sx={{ textAlign: "center" }}>
            <span style={{ fontSize: "12px" }}>{t(`openai.slowResponse`)}</span>{" "}
            <Link
              href="https://status.openai.com/"
              target="_blank"
              style={{ fontSize: "12px" }}
            >
              OpenAI status
            </Link>
            <Box
              sx={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
            >
              <span style={{ fontSize: "12px" }}>Dashboard</span>
              <IconButton size={"small"} onClick={handleExpandClick}>
                <ExpandMore
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.shortest,
                    }),
                  }}
                />
              </IconButton>
            </Box>
            <Box sx={{ position: "relative", pb: "130%", scale: "0.5" }}>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <iframe
                  style={{
                    position: "absolute",
                    top: "-50%",
                    width: "200%",
                    height: "100%",
                    left: "-50%",
                  }}
                  src="https://cloudwatch.amazonaws.com/dashboard.html?theme=light&dashboard=GPT-UA_Dashboard&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTIwNjgxMTU4MDM2NSIsIlUiOiJ1cy1lYXN0LTFfSUlPV3l6WGc0IiwiQyI6IjRldGQ2cTZtNHZqYzZidGRldGprYjdnNXBjIiwiSSI6InVzLWVhc3QtMTpjMDVkYTA4ZS0yMDdjLTQ0YTAtOWY0OC00Yzk1MWM5OTk5YTIiLCJNIjoiUHVibGljIn0="
                ></iframe>
              </Collapse>
            </Box>
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

function buildMessaages(
  conversation: ConversationElem[],
  lang: string
): Message[] {
  const messages: Message[] = [];
  for (const elem of conversation) {
    if (elem.dropped) continue;
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
    const c = localStorage.getItem("gpt_conversation");
    if (c) {
      const convArr = JSON.parse(c) as ConversationElem[];
      return convArr.map((e) => {
        return Object.assign(new ConversationElem(), e, { staticMode: true });
      });
    } else {
      return [ConversationElem.newPrompt(0, "")];
    }
  } catch (e) {
    return [ConversationElem.newPrompt(0, "")];
  }
};
