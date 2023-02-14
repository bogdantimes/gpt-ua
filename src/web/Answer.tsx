import * as React from "react";
import {Box, Button, Card, CircularProgress, Fade, IconButton, Link, Stack, Tooltip, Typography} from "@mui/material";
import {t} from "i18next";
import ReactMarkdown from "react-markdown";
import {ContentCopy, Reply} from "@mui/icons-material";
import {useState} from "react";

interface AnswerProps {
  answer: string;
  originalAnswer: string;
  lang: string;
  onReplyClick: (answer: string) => void;
}

const Answer: React.FC<AnswerProps> = ({answer, originalAnswer, lang, onReplyClick}) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [error, setError] = useState<null | string>("");
  const [showOriginal, setShowOriginal] = useState(false);

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
    <Card sx={{padding: 2, overflowX: "auto", position: "relative"}}>
      <Tooltip
        disableHoverListener
        open={cbTooltipOpen}
        title={t('clipboard.tooltip')}
        placement="left"
        TransitionComponent={Fade}
        TransitionProps={{timeout: 600}}>
        <Stack direction="row" alignItems="center" sx={{position: "absolute", bottom: 5, right: 5}}>
          <IconButton onClick={() => {
            onReplyClick(answer);
            document.getElementById("prompt")?.focus();
          }}><Reply/></IconButton>
          <IconButton onPointerDown={handleCopy}>
            <ContentCopy/>
          </IconButton>
        </Stack>
      </Tooltip>
      <ReactMarkdown>{showOriginal ? originalAnswer : answer}</ReactMarkdown>
      {lang !== "en" && <Link sx={{fontSize: 12, cursor: "pointer"}}
                              onClick={() => setShowOriginal(!showOriginal)}
      >
        {showOriginal ? t('answer.showTranslation') : t('answer.showOriginal')}
      </Link>}
    </Card>
  );
};

export default Answer;
