import React from 'react';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { AttachFile, Clear, Mic, Send, Stop } from '@mui/icons-material';
import { PromptProps } from './types';

const PromptVision: React.FC<PromptProps> = ({
  isStartPrompt,
  isAnsweredReply,
  text,
  showClear,
  setText,
  onClear,
  setFiles,
  setAudioData,
  files,
  MAX_FILES,
  visionDisabled,
  textTypes,
  handleFileUpload,
  elem,
  isRecording,
  stopRecording,
  startRecording,
  audioData,
  isIOS,
  sendDisabled,
  onClickSend,
}) => {
  return (
    <Box>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ alignSelf: 'end', mb: '10px' }}
          >
            {!isAnsweredReply && !audioData && !isIOS && !text && (
              <IconButton
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Stop /> : <Mic />}
              </IconButton>
            )}
            {!isAnsweredReply && (text || audioData) && (
              <IconButton
                onClick={() => {
                  elem.setText(text);
                  elem.setFiles(files);
                  elem.setAudioData(audioData);
                  onClickSend(elem);
                }}
                disabled={sendDisabled}
              >
                <Send />
              </IconButton>
            )}
          </InputAdornment>
        }
        startAdornment={
          <InputAdornment
            position="start"
            sx={{ alignSelf: 'start', mb: '10px' }}
          >
            {!isAnsweredReply && files.length < MAX_FILES && (
              <Box>
                <input
                  accept={
                    visionDisabled
                      ? textTypes
                      : `image/png,image/jpeg,image/webp,image/gif,${textTypes}`
                  }
                  multiple
                  style={{ display: 'none' }}
                  id={`file-btn-start-${elem.getId()}`}
                  type="file"
                  onChange={async (event) => {
                    if (event.target.files) {
                      await handleFileUpload(Array.from(event.target.files));
                    }
                  }}
                />
                <label htmlFor={`file-btn-start-${elem.getId()}`}>
                  <IconButton component={'span'}>
                    <AttachFile />
                  </IconButton>
                </label>
              </Box>
            )}
            {isStartPrompt && (text || showClear) && (
              <IconButton
                onClick={() => {
                  setText('');
                  onClear();
                  setFiles([]);
                  setAudioData('');
                }}
              >
                <Clear />
              </IconButton>
            )}
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default PromptVision;
