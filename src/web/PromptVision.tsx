import * as React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  AttachFile,
  Description,
  Cancel,
  Clear,
  Send,
  Mic,
  Stop,
  AudioFile,
} from '@mui/icons-material';
import { type PromptElem } from './Types';
import { t } from 'i18next';
import { pdfjs } from 'react-pdf';
import { FileDetail } from './Types';
import { handleImage, handlePDF, handleTextFile } from './FileHandlers';
import { ImagePreview, AudioPreview, TextFilePreview, DeleteButton } from './PromptVisionStyles';
import 'pdfjs-dist/build/pdf.worker.min';

const MAX_FILES = 5;
const MAX_TEXT_LENGTH = 1000;

pdfjs.GlobalWorkerOptions.workerSrc =
  '../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

interface PromptProps {
  elem: PromptElem;
  onClickSend: (el: PromptElem) => void;
  onClear: () => void;
  sendDisabled: boolean;
  showClear: boolean;
  visionDisabled: boolean;
}

const PromptVision: React.FC<PromptProps> = ({
  elem,
  onClickSend,
  onClear,
  sendDisabled,
  showClear,
  visionDisabled,
}) => {
  const [text, setText] = React.useState(elem.getText());
  const [files, setFiles] = React.useState<FileDetail[]>(elem.getFiles());
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioData, setAudioData] = React.useState<string>(elem.getAudioData());
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);

  const isStartPrompt = elem.getId() === 0;
  const isAnsweredReply = !isStartPrompt && elem.isAnswered();
  const label = isStartPrompt ? t('conversation.start') : t('conversation.you');

  const handleDeleteAudio = () => {
    setAudioData('');
    setText(''); // Clear text when audio is deleted
  };

  const handleFileUpload = async (newFiles: File[]) => {
    const updatedFiles: FileDetail[] = [...files];
    for (const file of newFiles) {
      if (updatedFiles.length >= MAX_FILES) break;
      let type: 'image' | 'text';
      let content: string;

      if (file.type.includes('image')) {
        type = 'image';
        content = await handleImage(file);
      } else if (file.type === 'application/pdf') {
        type = 'text';
        content = await handlePDF(file);
      } else {
        type = 'text';
        content = await handleTextFile(file);
      }

      if (visionDisabled && type === 'image') {
        continue;
      }

      const newFile: FileDetail = { name: file.name, type, content };
      updatedFiles.push(newFile);
    }
    setFiles(updatedFiles);
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData('text');
    
    if (pastedText.length > MAX_TEXT_LENGTH) {
      event.preventDefault();
      // Create a new file from the pasted text
      const blob = new Blob([pastedText], { type: 'text/plain' });
      const file = new File([blob], 'pasted.txt', { type: 'text/plain' });
      
      // Use the existing handleFileUpload function to process the new file
      await handleFileUpload([file]);
    }
  };

  let textTypes = '.pdf,.json,text/*,.ts*,.js*,.md,.java,.go,.py,.csv,.c,.cpp,.h,.html,.xml,.y*ml,.toml,.css,.bash,.sh,.bat';

  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            setAudioData(base64Audio);
            setText(''); // Clear text when audio is recorded
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorder.start();
      })
      .catch(error => console.error('Error starting recording:', error));
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Determine if the text input should be disabled
  const isTextInputDisabled = isAnsweredReply || !!audioData;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
      }}
    >
      <Box
        sx={{ display: !!files.length || audioData ? 'flex' : 'none', mb: 2 }}
      >
        {files.map((file, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            {file.type === 'image' && (
              <ImagePreview src={file.content} alt={file.name} />
            )}
            {file.type === 'text' && (
              <TextFilePreview>
                <Description />
                <div className="file-name">{file.name}</div>
              </TextFilePreview>
            )}
            {!isAnsweredReply && (
              <DeleteButton onClick={() => handleDeleteFile(index)}>
                <Cancel fontSize="small" />
              </DeleteButton>
            )}
          </Box>
        ))}
        {audioData && (
          <Box sx={{ position: 'relative' }}>
            <AudioPreview>
              <AudioFile />
              <div className="file-name">voice_rec.webm</div>
            </AudioPreview>
            {!isAnsweredReply && (
              <DeleteButton onClick={handleDeleteAudio}>
                <Cancel fontSize="small" />
              </DeleteButton>
            )}
          </Box>
        )}
      </Box>
      <TextField
        id={`prompt-${elem.getId()}`}
        label={label}
        value={text}
        multiline
        fullWidth
        focused={isAnsweredReply ? false : undefined}
        onChange={(event) => {
          if (!isTextInputDisabled) {
            setText(event.target.value);
          }
        }}
        onPaste={handlePaste}
        helperText={!isAnsweredReply && 'Ctrl+Enter'}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === 'Enter' && !isTextInputDisabled) {
            elem.setText(text);
            elem.setFiles(files);
            elem.setAudioData(audioData);
            onClickSend(elem);
          }
        }}
        InputProps={{
          readOnly: isTextInputDisabled,
          disabled: isTextInputDisabled,
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ alignSelf: 'end', mb: '10px' }}
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
                    id={`file-btn-${elem.getId()}`}
                    type="file"
                    onChange={async (event) => {
                      if (event.target.files) {
                        await handleFileUpload(Array.from(event.target.files));
                      }
                    }}
                  />
                  <label htmlFor={`file-btn-${elem.getId()}`}>
                    <IconButton component={'span'}>
                      <AttachFile />
                    </IconButton>
                  </label>
                </Box>
              )}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ alignSelf: 'end', mb: '10px' }}
            >
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
              {!isAnsweredReply && !audioData && !text && (
                <IconButton
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? <Stop /> : <Mic />}
                </IconButton>
              )}
              {!isAnsweredReply && (
                <IconButton
                  disabled={sendDisabled}
                  onClick={() => {
                    elem.setText(text);
                    elem.setFiles(files);
                    elem.setAudioData(audioData);
                    onClickSend(elem);
                  }}
                >
                  <Send />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PromptVision;
