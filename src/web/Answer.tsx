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
  Stack,
  Tooltip,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { type AnswerElem, type ChatMode } from "./Types";
import { mainIconBase64 } from "./Icon";
import { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import Markdown from "markdown-to-jsx";

interface AnswerProps {
  elem: AnswerElem;
  mode: ChatMode;
}

const Answer: React.FC<AnswerProps> = ({ elem, mode }) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false);
  const theme = useTheme();

  const toggleSpoiler = () => {
    setIsSpoilerOpen(!isSpoilerOpen);
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
    <Card
      sx={{
        padding: 2,
        overflowX: "auto",
        position: "relative",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(90deg, rgba(10, 24, 61, 1) 0%, rgba(3, 54, 73, 1) 100%)" // Dark theme gradient
            : "linear-gradient(90deg, rgba(216, 251, 204, 1) 0%, rgba(171, 229, 255, 1) 100%)", // Lighter light theme gradient
      }}
    >
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
            <Markdown
              options={{
                overrides: {
                  img: {
                    props: {
                      width: "100%",
                      crossOrigin: null,
                    },
                  },
                },
              }}
            >
              {elem.getText()}
            </Markdown>
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
            {spoilerText && <Markdown>{spoilerText}</Markdown>}
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
              {window.isSecureContext && !!navigator.clipboard && (
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
  );
};

export default Answer;
