import "./styles.css";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMore,
  Instagram,
  LinkedIn,
  Replay,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Answer from "./Answer";
import Prompt from "./Prompt";
import { type ChatMode, ConversationElem, type PromptElem } from "./Types";
import { FundingBar } from "./FundingBar";
import cyberpunkTheme from "./theme";
import { YesNoOverlay } from "./YesNoOverlay";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import ExtensionIcon from "@mui/icons-material/Extension";
import { StyledLinearProgress } from "./StyledLinearProgress";

// Define a styled Chip for better visuals
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  fontSize: "0.8rem",
}));

const VERSION = 23;
const YES_KEY = "yesAnswer";
const NO_KEY = "noAnswer";
const SESSION_COST_KEY = "sessionCost";
const REQUESTS_NUM_KEY = "requestsNum";
const USD_UAH_RATE = 40;

export default function App(): JSX.Element {
  const { t, i18n } = useTranslation("translation");
  const darkScheme = useMediaQuery(`(prefers-color-scheme: dark)`);

  const checkForCyberTheme = () => {
    return window.location.hash.includes("theme=cyber");
  };

  const getTheme = () => {
    if (checkForCyberTheme()) {
      return cyberpunkTheme;
    } else {
      return createTheme({ palette: { mode: darkScheme ? `dark` : `light` } });
    }
  };

  const [mode, setMode] = useState<ChatMode>(() => {
    try {
      return (localStorage.getItem("mode") as ChatMode) || "default";
    } catch (e) {
      return "default";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("mode", mode);
    } catch (e) {}
  }, [mode]);

  const [theme, setTheme] = useState(getTheme());
  useEffect(() => {
    setTheme(getTheme());
  }, [darkScheme]);

  const [error, setError] = useState<null | string>("");
  const [loading, setLoading] = useState(false);
  const [moneyLeft, setMoneyLeft] = useState<number | null>(null);

  const [limitBudget, setLimitBudget] = useState(() => {
    try {
      return !!localStorage.getItem("lb");
    } catch (e) {}
  });
  useEffect(() => {
    try {
      if (limitBudget) {
        localStorage.setItem("lb", "1");
      } else {
        localStorage.removeItem("lb");
      }
    } catch (e) {}
  }, [limitBudget]);

  const [conversation, setConversation] =
    useState<ConversationElem[]>(conversationLoader);
  useEffect(() => {
    try {
      localStorage.setItem("gpt_conversation", JSON.stringify(conversation));
    } catch (e) {}
  }, [conversation]);

  const lang = i18n.language;

  const changeLanguage = (lng) => {
    void i18n.changeLanguage(lng);
  };

  // initiate lang using the browser's language
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const browserLang = navigator?.language?.split("-")[0] || "en";
    const lang = params.get("lang") || browserLang;
    changeLanguage(lang);
  }, []);

  useEffect(() => {
    document.title = t("title");
  }, [lang]);

  useEffect(() => {
    const hash = window.location.hash;
    const promptMatch = /#prompt=([^&]*)/.exec(hash);
    if (promptMatch) {
      window.location.hash = "";
      const prompt = decodeURIComponent(promptMatch[1]);
      handleSend(ConversationElem.newPrompt(0, prompt));
    }
  }, []);

  function handleAnswer(gptReply: any, answer: string) {
    conversation.push(ConversationElem.newAnswer(conversation.length, answer));
    conversation.push(ConversationElem.newPrompt(conversation.length, ""));

    // Mark dropped messages
    const lastDroppedMessageId = gptReply.lastDroppedMessageId ?? -1;
    if (lastDroppedMessageId >= 0) {
      conversation.forEach((el) => {
        el.dropped = el.id <= lastDroppedMessageId;
      });
    }
    setConversation([...conversation]);
  }

  function sendConversation(onAnswer = () => {}) {
    const messages = buildMessages(conversation, lang);
    // @ts-expect-error external grecaptcha.enterprise
    grecaptcha.enterprise
      .execute("6LemuPokAAAAAGa_RpQfdiCHbbaolQ1i3g-EvNom", { action: "login" })
      .then(function (token) {
        const serviceURL =
          "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws";
        fetch(serviceURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            v: VERSION,
            l: limitBudget && requestsNum,
            token,
            messages,
            mode,
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
              setError("");
              const cost = gptReply?.cost || 0;
              setSessionCost(sessionCost + +cost);
              setRequestsNum(requestsNum + 1);
              const lastPrompt = conversation
                .filter((elem) => elem.isUser)
                .pop();
              if (lastPrompt) {
                lastPrompt.answered = true;
              }
              const answer = gptReply?.answer ?? "";
              if (answer) {
                onAnswer();
                handleAnswer(gptReply, answer);
              }
            }
            const budget = +gptReply?.moneyLeft;
            if (Number.isFinite(budget)) {
              setMoneyLeft(budget);
              if (budget <= 0) {
                setLimitBudget(true);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            setError(t(`errors.internal`));
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

    if (clarityMode && el.getText().length >= 280) {
      setError(t("errors.only280CharsSupported"));
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
    }, new Date().getMilliseconds());
  };

  const [dashBoardExpanded, setDashBoardExpanded] = useState(false);

  const handleExpandClick = () => {
    setDashBoardExpanded(!dashBoardExpanded);
  };

  const [askQuestion, setAskQuestion] = useState(false);
  const [yesAnswer, setYesAnswer] = useState(localStorage.getItem(YES_KEY));
  const [noAnswer, setNoAnswer] = useState(localStorage.getItem(NO_KEY));
  const [sessionCost, setSessionCost] = useState<number>(() => {
    const savedSessionCost = localStorage.getItem(SESSION_COST_KEY);
    return savedSessionCost ? parseFloat(savedSessionCost) : 0;
  });
  const [requestsNum, setRequestsNum] = useState(() => {
    const reqNum = localStorage.getItem(REQUESTS_NUM_KEY);
    return reqNum ? +reqNum : 0;
  });

  useEffect(() => {
    localStorage.setItem(SESSION_COST_KEY, sessionCost.toString());
  }, [sessionCost]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_NUM_KEY, requestsNum.toString());
  }, [requestsNum]);

  useEffect(() => {
    localStorage.setItem(YES_KEY, yesAnswer || "");
  }, [yesAnswer]);

  useEffect(() => {
    localStorage.setItem(NO_KEY, noAnswer || "");
  }, [noAnswer]);

  function isTimePassed(date: string | null, duration: number) {
    if (date) {
      const answerDate = new Date(date);
      const timeDifference = +new Date() - +answerDate;
      return timeDifference >= duration;
    }
    return true;
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  useEffect(() => {
    const showQuestionForNoAnswer = noAnswer && isTimePassed(noAnswer, oneDay);
    const showQuestionForYesAnswer =
      !noAnswer && isTimePassed(yesAnswer, oneWeek);

    setAskQuestion(showQuestionForNoAnswer || showQuestionForYesAnswer);
  }, [sessionCost, yesAnswer, noAnswer]);

  const handleClickYes = () => {
    setAskQuestion(false);
    setNoAnswer("");
    setYesAnswer(new Date().toISOString());
  };

  const handleClickNo = () => {
    setAskQuestion(false);
    setYesAnswer("");
    setNoAnswer(new Date().toISOString());
  };

  function handleTopUpBtnClick() {
    // @ts-expect-error external gtag
    gtag("event", "budget_top_up_open");
    window.open(`https://send.monobank.ua/jar/3Q3K3VdHuU`, "_blank");
    // reset the budget limit timer
    setLimitBudget(false);
    setSessionCost(0);
    setRequestsNum(0);
  }

  const modes: ChatMode[] = ["default", "gpt4", "research", "wiki", "wolfram"];
  const clarityMode = ["research", "wiki", "wolfram"].includes(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ padding: 2 }}>
        <Stack spacing={2}>
          {/* center aligned GPT-UA */}
          <Box sx={{ padding: 1, textAlign: "center", position: "relative" }}>
            <h1>{t("name")}</h1>
            <p
              style={{
                marginLeft: "10px",
                marginTop: "-33px",
                marginBottom: 0,
                padding: 0,
              }}
            >
              ChatGPT | Online Research | Science
              <br />
              🔎🌐
            </p>
          </Box>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <ButtonGroup
              size={"small"}
              color="primary"
              aria-label="outlined primary button group"
            >
              {modes.map((m: ChatMode) => (
                <Button
                  key={m}
                  variant={mode === m ? "contained" : "outlined"}
                  onClick={() => {
                    setMode(m);
                  }}
                >
                  {t(`mode.${m}`)}
                </Button>
              ))}
            </ButtonGroup>
            <Alert severity={"info"} sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary" align="center">
                {t(`mode.note_${mode}`)}
                {clarityMode && (
                  <Typography display="block" variant={"caption"}>
                    <Link
                      target="_blank"
                      href="https://www.patreon.com/BogdanTimes/shop/claritybot-service-5-top-up-2309"
                    >
                      Powered by Clarity AI Service
                    </Link>
                  </Typography>
                )}
              </Typography>
            </Alert>
          </Box>
          {conversation
            // in non default mode, display only first QA
            .slice(0, clarityMode ? 2 : undefined)
            .map((elem, i) => {
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
                <Answer key={i} elem={elem} mode={mode} />
              );
            })}
          {loading && <StyledLinearProgress />}
          {error && (
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="retry"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      sendConversation();
                    }, new Date().getMilliseconds());
                  }}
                >
                  <Replay />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}
          {!!sessionCost && (
            <Box sx={{ textAlign: "center" }}>
              <Tooltip
                enterTouchDelay={1}
                leaveTouchDelay={2000}
                title="This is the amount of shared site budget money that you have spent in total."
                placement="top"
              >
                <StyledChip
                  icon={<InfoIcon color={"inherit"} />}
                  label={t(`spentChip`, {
                    costUSD: +sessionCost.toFixed(
                      sessionCost > 0.01 ? 2 : sessionCost > 0.001 ? 3 : 4,
                    ),
                    costUAH: +(sessionCost * USD_UAH_RATE).toFixed(1),
                  })}
                />
              </Tooltip>
            </Box>
          )}
          {Number.isFinite(moneyLeft) && (
            <Alert
              sx={{
                textAlign: "center",
                "& .MuiAlert-message": { width: "100%" },
              }}
              icon={false}
              severity={moneyLeft! <= 1 ? "warning" : "info"}
            >
              <FundingBar target={20} value={moneyLeft!}>
                <>
                  <Button
                    variant="contained"
                    size={"small"}
                    onClick={handleTopUpBtnClick}
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
                    {t(`budget.mono`)}
                  </Button>
                  <Typography ml={"auto"} mr={"auto"} variant={"caption"}>
                    (Monobank / Google Pay / Visa / Mastercard)
                    <br />
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
            <Grid item>
              <Link
                href="https://chrome.google.com/webstore/detail/gpt-uaclick-chrome/fbbjiglnminppnhbddnihgeoipoamhnm"
                target="_blank"
              >
                <ExtensionIcon
                  className={`pulsating-icon-${theme.palette.mode}`}
                />
              </Link>
            </Grid>
          </Grid>
          {theme !== cyberpunkTheme && (
            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Link
                href="https://gpt-ua.click/#theme=cyber"
                className="cyber-link"
              >
                Cyberpunk 2077 style
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
                    transform: dashBoardExpanded ? "rotate(180deg)" : "none",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.shortest,
                    }),
                  }}
                />
              </IconButton>
            </Box>
            <Box sx={{ position: "relative", pb: "130%", scale: "0.5" }}>
              <Collapse in={dashBoardExpanded} timeout="auto" unmountOnExit>
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
      {sessionCost * USD_UAH_RATE >= 1 && askQuestion && (
        <YesNoOverlay
          requestsNum={requestsNum}
          costUAH={sessionCost * USD_UAH_RATE}
          costUSD={sessionCost}
          onClickYes={handleClickYes}
          onClickNo={handleClickNo}
        />
      )}
    </ThemeProvider>
  );
}

interface Message {
  id: number;
  lang: string;
  original: string;
  isUser: boolean;
}

function buildMessages(
  conversation: ConversationElem[],
  lang: string,
): Message[] {
  const messages: Message[] = [];
  for (const elem of conversation) {
    if (elem.dropped) continue;
    messages.push({
      lang,
      id: elem.getId(),
      original: `${elem.getText()}`,
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
