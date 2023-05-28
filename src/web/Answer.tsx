import * as React from "react";
import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Collapse,
  Fade,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { ContentCopy, Share } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { type AnswerElem } from "./Types";
import Typist from "react-typist";
import gfm from "remark-gfm";
import html2canvas from "html2canvas";
import { mainIconBase64 } from "./Icon";
import { t } from "i18next";
import { useTheme } from "@mui/material/styles";

interface AnswerProps {
  elem: AnswerElem;
}

const Answer: React.FC<AnswerProps> = ({ elem }) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const theme = useTheme();

  const toggleSpoiler = () => {
    setIsSpoilerOpen(!isSpoilerOpen);
  };

  const captureRef = useRef<HTMLDivElement | null>(null);
  const handleShare = async () => {
    setScreenshotMode(true); // Hide the buttons
    setTimeout(async () => {
      const canvas = await html2canvas(captureRef.current!, {
        backgroundColor: null, // or set it to your component's background color
      });
      setScreenshotMode(false); // Show the buttons again
      const blob: BlobPart = await new Promise((resolve) => {
        canvas.toBlob(resolve as BlobCallback, "image/png");
      });
      const file = new File([blob], "screenshot.png", { type: "image/png" });

      try {
        await navigator.share({
          files: [file],
          title: t("title")!,
          url: "https://gpt-ua.click",
          text: elem.getAllText(),
        });

        console.log("Sharing was successful.");
        // @ts-expect-error external gtag
        gtag("event", "shared");
      } catch (err) {
        // @ts-expect-error external gtag
        gtag("event", "shareFailed");
        console.error("There was an error sharing.", err);
      }
    }, 0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(elem.getAllText());
    setCbTooltipOpen(true);
    setTimeout(() => {
      setCbTooltipOpen(false);
    }, 2000);
  };

  const spoilerText = elem.getSpoilerText();

  return (
    <Box ref={captureRef}>
      <Card
        sx={{
          padding: 2,
          overflowX: "auto",
          position: "relative",
          background: screenshotMode
            ? theme.palette.mode === "dark"
              ? "linear-gradient(90deg, rgba(10, 24, 61, 1) 0%, rgba(3, 54, 73, 1) 100%)" // Dark theme gradient
              : "linear-gradient(90deg, rgba(176, 233, 157, 1) 0%, rgba(123, 201, 246, 1) 100%)" // Light theme gradient
            : undefined,
        }}
      >
        {screenshotMode && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "rgba(72, 52, 212, 0.6)",
              padding: 1,
              borderRadius: "0 0 0 4px", // Rounded corner
              fontSize: "14px", // Size of the watermark
              color: "#D3D3D3",
            }}
          >
            ⚡ gpt-ua.click
          </Box>
        )}
        <Grid container direction={"row"} spacing={2} rowSpacing={-1}>
          <Grid item xs={12} sm={1}>
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
          <Grid item xs={12} sm={11} sx={{ pr: 2 }}>
            <Box
              onClick={toggleSpoiler}
              sx={{
                display: spoilerText ? "flex" : "block",
                alignItems: "center",
                cursor: spoilerText ? "pointer" : "default",
              }}
            >
              {elem.isStatic() ? (
                <ReactMarkdown remarkPlugins={[gfm]}>
                  {elem.getText()}
                </ReactMarkdown>
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
                    transform: isSpoilerOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: ".3s",
                    ml: 1,
                  }}
                />
              )}
            </Box>
            <Collapse in={isSpoilerOpen && !!spoilerText}>
              {spoilerText && (
                <ReactMarkdown remarkPlugins={[gfm]}>
                  {spoilerText}
                </ReactMarkdown>
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
                {!!navigator.share && !screenshotMode && (
                  <IconButton
                    onClick={() => {
                      void handleShare();
                    }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                )}
                {window.isSecureContext &&
                  !!navigator.clipboard &&
                  !screenshotMode && (
                    <IconButton
                      onClick={() => {
                        void handleCopy();
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  )}
              </Stack>
            </Tooltip>
          </Box>
        </Grid>
      </Card>
    </Box>
  );
};

export default Answer;
