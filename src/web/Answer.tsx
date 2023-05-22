import * as React from "react";
import { useState } from "react";
import {
  Box,
  Card,
  Collapse,
  Fade,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { t } from "i18next";
import ReactMarkdown from "react-markdown";
import { ContentCopy, Favorite, FavoriteBorder } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { type AnswerElem, type ConversationElem } from "./Types";
import Typist from "react-typist";
import gfm from "remark-gfm";

interface AnswerProps {
  elem: AnswerElem;
}

const Answer: React.FC<AnswerProps> = ({ elem }) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [error, setError] = useState<null | string>("");
  const [liked, setLiked] = useState<boolean>(elem.isLiked());

  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false);

  const toggleSpoiler = () => {
    setIsSpoilerOpen(!isSpoilerOpen);
  };

  const handleCopy = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(elem.getAllText());
      setCbTooltipOpen(true);
      setTimeout(() => {
        setCbTooltipOpen(false);
      }, 2000);
    } else {
      setError(t("errors.insecureContext"));
    }
  };

  const spoilerText = elem.getSpoilerText();
  return (
    <Card sx={{ padding: 2, overflowX: "auto", position: "relative" }}>
      <Tooltip
        disableHoverListener
        open={cbTooltipOpen}
        title={t("clipboard.tooltip")}
        placement="left"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: "absolute",
            bottom: 3,
            right: 3,
            "&:hover button:first-of-type": { opacity: 1 }, // Show Copy button when Box is hovered
          }}
        >
          <IconButton
            onPointerDown={handleCopy}
            sx={{
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": { opacity: 1 }, // Show when hovered
              "@media (hover: none)": {
                // Styles for devices that don't support hover
                opacity: 1,
              },
            }}
          >
            <ContentCopy />
          </IconButton>
          <IconButton
            disabled={liked}
            onPointerDown={() => {
              setLiked(true);
              (elem as ConversationElem).liked = true;
              // @ts-expect-error external gtag
              gtag("event", "like");
            }}
          >
            {" "}
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Stack>
      </Tooltip>
      <Box
        onClick={toggleSpoiler}
        sx={{
          display: spoilerText ? "flex" : "block",
          alignItems: "center",
          cursor: spoilerText ? "pointer" : "default",
        }}
      >
        {elem.isStatic() ? (
          <ReactMarkdown remarkPlugins={[gfm]}>{elem.getText()}</ReactMarkdown>
        ) : (
          <Typist
            key={`${elem.getId()}_${elem.getText().length}`}
            avgTypingDelay={0}
            stdTypingDelay={40}
            cursor={{ show: false }}
          >
            <ReactMarkdown remarkPlugins={[gfm]}>
              {elem.getText()}
            </ReactMarkdown>
          </Typist>
        )}
        {spoilerText && (
          <ExpandMoreIcon
            sx={{
              transform: isSpoilerOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: ".3s",
              ml: 1,
            }}
          />
        )}
      </Box>
      <Collapse in={isSpoilerOpen && !!spoilerText}>
        {spoilerText && (
          <ReactMarkdown remarkPlugins={[gfm]}>{spoilerText}</ReactMarkdown>
        )}
      </Collapse>
    </Card>
  );
};

export default Answer;
