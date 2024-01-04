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
  CssBaseline,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
  Replay,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Answer from "./Answer";
import {
  type ChatMode,
  ChatModes,
  ConversationElem,
  type PromptElem,
} from "./Types";
import { FundingBar } from "./FundingBar";
import { cyberpunkTheme, darkTheme, lightTheme, personalTheme } from "./themes";
import { YesNoOverlay } from "./YesNoOverlay";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import ExtensionIcon from "@mui/icons-material/Extension";
import { StyledLinearProgress } from "./StyledLinearProgress";
import { PersonalBudget } from "./PersonalBudget";
import PromptVision from "./PromptVision";

// Define a styled Chip for better visuals
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  fontSize: "0.8rem",
}));

const VERSION = 31;
const YES_KEY = "yesAnswer";
const NO_KEY = "noAnswer";
const SESSION_COST_KEY = "sessionCost";
const REQUESTS_NUM_KEY = "requestsNum";
const USD_UAH_RATE = 40;

export default function App(): JSX.Element {
  const [firstTimeModalOpen, setFirstTimeModalOpen] = useState(false);

  useEffect(() => {
    // Retrieve the visit count from local storage, or start with 0 if it doesn't exist
    const visitCount = parseInt(localStorage.getItem("visitCount") || "0", 10);
    // Increment the visit count
    localStorage.setItem("visitCount", (visitCount + 1).toString());
    // If this is the second visit (visitCount was 1 before incrementing), open the modal
    if (visitCount === 1) {
      setFirstTimeModalOpen(true);
    }
  }, []);

  const { t, i18n } = useTranslation("translation");
  const darkScheme = useMediaQuery(`(prefers-color-scheme: dark)`);

  const checkForCyberTheme = () => {
    return window.location.hash.includes("theme=cyber");
  };

  const checkForApiKey = () => {
    return window.location.search.includes("key=");
  };

  const getTheme = () => {
    if (checkForCyberTheme()) {
      return cyberpunkTheme;
    } else if (checkForApiKey()) {
      return personalTheme;
    } else {
      return darkScheme ? darkTheme : lightTheme;
    }
  };

  const [mode, setMode] = useState<ChatMode>(() => {
    try {
      const _mode = (localStorage.getItem("mode") as ChatMode) || "default";
      return ChatModes.includes(_mode) ? _mode : "default";
    } catch (e) {
      return "default";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("mode", mode);
    } catch (e) {}
  }, [mode]);

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

  const conversationLength = () => conversation.filter((e) => !e.pinned).length;

  useEffect(() => {
    if (!conversationLength()) {
      conversation.push(ConversationElem.newPrompt(conversationLength(), ""));
      setConversation([...conversation]);
    }
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

  const [apiKey, setApiKey] = useState("");
  const [topUpLink, setTopUpLink] = useState("");
  // read the api-key (if present)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key") || "";
    setApiKey(key);
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

  const [theme, setTheme] = useState(getTheme());
  useEffect(() => {
    setTheme(getTheme());
  }, [darkScheme, apiKey]);

  function handleAnswer(answer: string, lastDroppedMessageId = -1) {
    const aElem: ConversationElem = ConversationElem.newAnswer(
      conversationLength(),
      answer,
    );
    conversation.push(aElem);
    conversation.push(ConversationElem.newPrompt(conversationLength(), ""));

    // Mark dropped messages
    if (lastDroppedMessageId >= 0) {
      conversation.forEach((el) => {
        el.dropped = el.id <= lastDroppedMessageId;
      });
    }
    setConversation([...conversation]);
  }

  function sendConversation() {
    const messages = buildMessages(conversation, lang, mode === "gpt4");
    // @ts-expect-error external grecaptcha.enterprise
    grecaptcha.enterprise
      .execute("6LemuPokAAAAAGa_RpQfdiCHbbaolQ1i3g-EvNom", { action: "login" })
      .then(function (token) {
        const serviceURL =
          "https://2g5qt6esgqbgc6cuvkfp7kgq4m0ugzcm.lambda-url.eu-west-3.on.aws";
        const headers = {
          "Content-Type": "application/json",
          Authorization: apiKey ? `Bearer ${apiKey}` : undefined,
        };
        fetch(serviceURL, {
          method: "POST",
          headers: headers as HeadersInit,
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
              setError((gptReply?.answer as string) || gptReply?.error);
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
                handleAnswer(answer as string, +gptReply.lastDroppedMessageId);
              }
            }
            const budget = +gptReply?.moneyLeft;
            if (Number.isFinite(budget)) {
              setMoneyLeft(budget);
              if (gptReply.topUpLink) {
                setTopUpLink(gptReply.topUpLink as string);
              }
              if (!gptReply.topUpLink && apiKey) {
                setError(t("errors.apiKey", { key: apiKey }));
              }
              if (budget <= 0 && !apiKey) {
                setLimitBudget(true);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            if (!err?.message || err?.message?.match(/internal/gi)) {
              setError(t(`errors.internal`));
            } else {
              setError(err.message as string);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function clearConversation(startText: string, image: string) {
    const pinned = conversation
      .filter((el) => el.pinned)
      .map((e) => {
        // assign a random ID to make it a unique msg, as the original conversation is being cleared,
        // so that new messages do not match ID with these pinned ones
        e.id = Math.floor(Math.random() * 1e6);
        return e;
      });
    conversation.splice(0);
    const initPrompt = ConversationElem.newPrompt(0, startText);
    initPrompt.setImage(image);
    conversation.push(...pinned, initPrompt);
    setConversation([...conversation]);
  }

  const handleSend = (el: PromptElem) => {
    setError("");

    if (el.getText().length <= 1 && (mode !== "gpt4" || !el.getImage())) {
      setError(t("errors.notEnoughDetails"));
      return;
    }

    // if el is start prompt, then clear the conversation
    if (el.getId() === 0) {
      clearConversation(el.getText(), el.getImage());
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
    window.open(topUpLink, "_blank");
    // reset the budget limit timer
    setLimitBudget(false);
    setSessionCost(0);
    setRequestsNum(0);
  }

  const modes: ChatMode[] = ["default", "gpt4", "gpt4+"];

  const topUpButton = (
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
  );

  const unpinAnswer = (id: number) => {
    setConversation([
      ...conversation.filter((el) => !(el.id === id && el.pinned)),
    ]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {firstTimeModalOpen && (
        <Dialog open={firstTimeModalOpen}>
          <DialogTitle style={{ fontWeight: "bold", textAlign: "center" }}>
            {t("welcomeTitle")}
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <DialogContentText sx={{ mb: 1 }}>
              {t("welcomeMessage")}
            </DialogContentText>
            <Button
              variant="contained"
              href="https://t.me/gpt_ua_chat"
              target="_blank"
              onClick={() => {
                setFirstTimeModalOpen(false);
              }} // Closes modal on click
              style={{
                backgroundImage: "linear-gradient(45deg, #0198E1, #0575E6)",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.25)",
                color: "#ffffff",
                fontWeight: "bold",
                textTransform: "none",
                padding: "12px 30px",
                fontSize: "1rem",
              }}
            >
              <Telegram />
              &nbsp;
              {t("telegramLinkText")}
            </Button>
          </DialogContent>
        </Dialog>
      )}

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
              </Typography>
            </Alert>
          </Box>
          {conversation
            .filter((e) => e.isPinned())
            .map((elem, i) => {
              return (
                <Answer
                  key={i}
                  elem={elem}
                  mode={mode}
                  onUnpin={() => {
                    unpinAnswer(elem.id);
                  }}
                />
              );
            })}
          <Divider style={{ marginBottom: "24px" }} />
          {conversation
            .filter((e) => !e.isPinned())
            .map((elem, i) => {
              const hasPinnedCopy = conversation.some(
                (e) => e.id === elem.id && e.pinned,
              );
              const promptProps = {
                key: `${i}_${elem.text.length}`,
                elem,
                onClickSend: handleSend,
                onClear: () => {
                  clearConversation("", "");
                },
                showClear: conversationLength() > 1,
                sendDisabled: loading,
                visionDisabled: mode !== "gpt4",
              };
              return elem.isUser ? (
                <PromptVision {...promptProps} />
              ) : (
                <Answer
                  key={i}
                  elem={elem}
                  mode={mode}
                  onUnpin={
                    hasPinnedCopy
                      ? () => {
                          unpinAnswer(elem.id);
                        }
                      : undefined
                  }
                  onPin={
                    hasPinnedCopy
                      ? undefined
                      : () => {
                          const pinElem = ConversationElem.newAnswer(
                            elem.id,
                            elem.getText(),
                          );
                          pinElem.pinned = true;
                          pinElem.dropped = true;
                          setConversation([pinElem, ...conversation]);
                        }
                  }
                />
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
            <Box sx={{ textAlign: "center", pt: 3 }}>
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
          {topUpLink && Number.isFinite(moneyLeft) && (
            <Alert
              sx={{
                textAlign: "center",
                "& .MuiAlert-message": { width: "100%" },
              }}
              icon={false}
              severity={moneyLeft! <= 1 ? "warning" : "info"}
            >
              {apiKey ? (
                <PersonalBudget value={moneyLeft!}>
                  {topUpButton}
                </PersonalBudget>
              ) : (
                <FundingBar target={20} value={moneyLeft!}>
                  {topUpButton}
                </FundingBar>
              )}
            </Alert>
          )}
          <Grid
            container
            justifyContent="center"
            spacing={2}
            paddingRight={"30px"}
          >
            <Grid item>
              <Link href="https://twitter.com/PlentyOfClarity" target="_blank">
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
                href="https://chrome.google.com/webstore/detail/gpt-ua-clarity-ai-chrome/fbbjiglnminppnhbddnihgeoipoamhnm"
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
  images?: string[];
}

function buildMessages(
  conversation: ConversationElem[],
  lang: string,
  vision: boolean,
): Message[] {
  const messages: Message[] = [];
  for (const elem of conversation) {
    if (elem.dropped) continue;
    messages.push({
      lang,
      id: elem.getId(),
      original: `${elem.getText()}`,
      isUser: elem.isUser,
      images: vision ? (elem.image ? [elem.image] : undefined) : undefined,
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
