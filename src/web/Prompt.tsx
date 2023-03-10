import * as React from "react";
import {
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  OutlinedInput,
  TextField
} from "@mui/material";
import {t} from "i18next";
import {Clear, Send} from "@mui/icons-material";
import {ConversationElem, PromptElem} from "./Types";
import ReactMarkdown from "react-markdown";
import {useEffect} from "react";

interface PromptProps {
  elem: PromptElem;
  onClickSend: (el: PromptElem) => void;
  onClear: () => void;
  sendDisabled: boolean;
  showClear: boolean;
}

const Prompt: React.FC<PromptProps> = ({elem, onClickSend, onClear, sendDisabled, showClear}) => {
  const [text, setText] = React.useState(elem.getText());
  const isStartPrompt = elem.getId() === 0;
  const isAnsweredReply = !isStartPrompt && elem.isAnswered();
  const label = isStartPrompt ? t("conversation.start") : t("conversation.you");
  return (
    <TextField
      id={`prompt-${elem.getId()}`}
      label={label}
      value={text}
      multiline
      focused={isAnsweredReply ? false : undefined}
      onChange={(event) => setText(event.target.value)}
      helperText={!isAnsweredReply && 'Ctrl+Enter'}
      onKeyDown={(event) => {
        if (event.ctrlKey && event.key === "Enter") {
          elem.setText(text)
          onClickSend(elem);
        }
      }}
      InputProps={{
        readOnly: isAnsweredReply,
        endAdornment:
          <>
            {isStartPrompt && (text || showClear) && <IconButton onClick={() => {
              setText('')
              onClear()
            }}><Clear/></IconButton>}
            <IconButton sx={{opacity: isAnsweredReply ? 0 : 1}} disabled={sendDisabled || isAnsweredReply}
                        onClick={() => {
                          elem.setText(text)
                          onClickSend(elem);
                        }}>
              <Send/>
            </IconButton>
          </>
      }}
    />
  );
};

export default Prompt;
