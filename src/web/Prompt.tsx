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
import {Send} from "@mui/icons-material";
import {ConversationElem, PromptElem} from "./Types";
import ReactMarkdown from "react-markdown";

interface PromptProps {
  elem: PromptElem;
  onClickSend: (el: PromptElem) => void;
  sendDisabled: boolean;
}

const Prompt: React.FC<PromptProps> = ({elem, onClickSend, sendDisabled}) => {
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
      focused={isStartPrompt ? undefined : !isAnsweredReply}
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
          !isAnsweredReply && <IconButton disabled={sendDisabled} onClick={() => onClickSend(elem)}>
            <Send/>
          </IconButton>
      }}
    />
  );
};

export default Prompt;
