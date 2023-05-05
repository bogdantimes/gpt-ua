import * as React from "react";
import { useState } from "react";
import { Card, Fade, IconButton, Stack, Tooltip } from "@mui/material";
import { t } from "i18next";
import ReactMarkdown from "react-markdown";
import { ContentCopy } from "@mui/icons-material";
import { AnswerElem } from "./Types";
import Typist from "react-typist";
import gfm from "remark-gfm";

interface AnswerProps {
  elem: AnswerElem;
}

const Answer: React.FC<AnswerProps> = ({elem}) => {
  const [cbTooltipOpen, setCbTooltipOpen] = useState(false);
  const [error, setError] = useState<null | string>("");

  const handleCopy = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(elem.getText());
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
      {elem.isStatic() ?
        <ReactMarkdown remarkPlugins={[gfm]}>
          {elem.getText()}
        </ReactMarkdown> :
        <Typist key={`${elem.getId()}_${elem.getText().length}`} avgTypingDelay={0} stdTypingDelay={40}
                cursor={{show: false}}>
          <ReactMarkdown remarkPlugins={[gfm]}>
            {elem.getText()}
          </ReactMarkdown>
        </Typist>}
    </Card>
  );
};

export default Answer;
