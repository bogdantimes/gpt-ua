import * as React from "react";
import {Box, Button, Card, CircularProgress, Fade, IconButton, Link, Stack, Tooltip, Typography} from "@mui/material";
import {t} from "i18next";
import ReactMarkdown from "react-markdown";
import {ContentCopy, Reply} from "@mui/icons-material";
import {useState} from "react";
import {ConversationElem, AnswerElem} from "./Types";
import Typist from 'react-typist';

interface AnswerProps {
  lang: string;
  elem: AnswerElem;
}

const Answer: React.FC<AnswerProps> = ({elem, lang}) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [error, setError] = useState<null | string>("");
  const [showOriginal, setShowOriginal] = useState(elem.getShowOriginal());

  const handleCopy = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(elem.getShowOriginal() ? elem.getOriginalText() : elem.getText());
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
          <IconButton onPointerDown={handleCopy}>
            <ContentCopy/>
          </IconButton>
        </Stack>
      </Tooltip>
      <Typist key={+showOriginal} avgTypingDelay={1} stdTypingDelay={50} cursor={{show: false}}>
        <ReactMarkdown>
          {showOriginal ? elem.getOriginalText() : elem.getText()}
        </ReactMarkdown>
      </Typist>

      {lang !== "en" && <Link sx={{fontSize: 12, cursor: "pointer"}}
                              onClick={() => setShowOriginal(!showOriginal)}
      >
        {showOriginal ? t('answer.showTranslation') : t('answer.showOriginal')}
      </Link>}
    </Card>
  );
};

export default Answer;
