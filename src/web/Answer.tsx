import * as React from "react";
import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Collapse,
  Fade,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy,
  ExpandMore,
  PushPin,
  PushPinOutlined,
  QuestionMark,
} from "@mui/icons-material";
import { type AnswerElem, type ChatMode } from "./Types";
import { mainIconBase64 } from "./Icon";
import { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import Markdown from "markdown-to-jsx";

interface AnswerProps {
  elem: AnswerElem;
  mode: ChatMode;
  onPin?: () => void;
  onUnpin?: () => void;
}

const PinSpoiler = 25;

function renderMedia(elem: AnswerElem) {
  const media = elem.getMedia();

  if (!media) {
    return null;
  }

  return (
    <ImageList cols={1} sx={{ width: "90%" }}>
      {media.map((m, i) => (
        <ImageListItem key={i}>
          <img
            src={`data:image/png;base64,${m.b64_json}`}
            alt={m.revised_prompt}
            loading="lazy"
            style={{ borderRadius: "5px" }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const Answer: React.FC<AnswerProps> = ({ elem, mode, onPin, onUnpin }) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false);
  const theme = useTheme();

  const toggleSpoiler = () => {
    setIsSpoilerOpen(!isSpoilerOpen);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(elem.getText());
    setCbTooltipOpen(true);
    setTimeout(() => {
      setCbTooltipOpen(false);
    }, 2000);
  };

  const showSpoiler = elem.isPinned();

  const spoilerVisibleText = elem
    .getText()
    .slice(0, PinSpoiler)
    .replace(/\S+$/, "");
  const markdownOptions = {
    overrides: {
      img: {
        props: {
          width: "90%",
          crossOrigin: null,
        },
      },
      a: {
        props: {
          target: "_blank",
        },
      },
    },
  };
  return (
    <Card
      sx={{
        padding: elem.isPinned() && !isSpoilerOpen ? "8px 16px" : "28px 16px",
        overflowX: "auto",
        position: "relative",
        background: elem.isPinned()
          ? undefined
          : theme.palette.mode === "dark"
            ? "linear-gradient(90deg, rgba(10, 24, 61, 1) 0%, rgba(3, 54, 73, 1) 100%)" // Dark theme gradient
            : "linear-gradient(90deg, rgba(216, 251, 204, 1) 0%, rgba(171, 229, 255, 1) 100%)", // Lighter light theme gradient
        transition: "padding 0.3s ease", // Adding transition for padding
      }}
    >
      {!elem.isPinned() && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "rgba(72, 52, 212, 0.6)",
            padding: 1,
            borderRadius: "0 0 0 4px", // Rounded corner
            fontSize: "16px", // Size of the watermark
            color: "#D3D3D3",
            lineHeight: "10px",
          }}
        >
          ⚡ gpt-ua.click
        </Box>
      )}
      <Grid container direction={"row"} spacing={2} rowSpacing={-1}>
        <Grid item xs={1}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              alignSelf: "center",
            }}
            alt="GPT-UA Avatar"
            src={mainIconBase64}
          />
        </Grid>
        <Grid item xs={11}>
          <Box
            onClick={toggleSpoiler}
            sx={{
              display: showSpoiler ? "flex" : "block",
              alignItems: "center",
              cursor: showSpoiler ? "pointer" : "default",
              pl: 1,
              color:
                showSpoiler && isSpoilerOpen
                  ? theme.palette.text.disabled
                  : undefined,
              transition: "color 0.3s ease",
            }}
          >
            <Markdown options={markdownOptions}>
              {showSpoiler ? spoilerVisibleText + " ..." : elem.getText()}
            </Markdown>
            {!showSpoiler && renderMedia(elem)}
            {showSpoiler && (
              <ExpandMore
                sx={{
                  transform: isSpoilerOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: ".3s",
                  ml: 1,
                }}
              />
            )}
          </Box>
          <Collapse in={isSpoilerOpen && showSpoiler}>
            {showSpoiler && (
              <Box mt={1}>
                <Markdown options={markdownOptions}>{elem.getText()}</Markdown>
                {renderMedia(elem)}
              </Box>
            )}
          </Collapse>
        </Grid>
        <Box sx={{ position: "absolute", right: 0, bottom: 0 }}>
          <Tooltip
            disableHoverListener
            open={cbTooltipOpen}
            title={t("clipboard.tooltip")}
            placement="left"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <Stack direction="row" alignItems="center">
              {!elem.isPinned() && (
                <IconButton
                  onClick={() => {
                    // @ts-expect-error external gtag
                    gtag("event", "tg_chat_open");
                    window.open("https://t.me/gpt_ua_chat", "_blank");
                  }}
                >
                  <QuestionMark fontSize="small" />
                </IconButton>
              )}
              {window.isSecureContext && !!navigator.clipboard && (
                <IconButton
                  onClick={() => {
                    void handleCopy();
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              )}
              {onUnpin && (
                <IconButton
                  onClick={() => {
                    // @ts-expect-error external gtag
                    gtag("event", "answer_unpinned");
                    onUnpin();
                  }}
                >
                  <PushPin fontSize="small" />
                </IconButton>
              )}{" "}
              {onPin && (
                <IconButton
                  onClick={() => {
                    // @ts-expect-error external gtag
                    gtag("event", "answer_pinned");
                    onPin();
                  }}
                >
                  <PushPinOutlined fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Tooltip>
        </Box>
      </Grid>
    </Card>
  );
};

export default Answer;
