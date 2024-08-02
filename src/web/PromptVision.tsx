import * as React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  styled,
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
import 'pdfjs-dist/build/pdf.worker.min';

const MAX_FILES = 5;

pdfjs.GlobalWorkerOptions.workerSrc =
  '../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

// Styling the ImagePreview component with MUI's styled API
const ImagePreview = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginRight: theme.spacing(2),
}));

const AudioPreview = styled('div')(({ theme }) => ({
  width: 50,
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginRight: theme.spacing(1),
  fontSize: '0.875rem',
  color: theme.palette.common.white,
  '& .file-name': {
    fontSize: '0.75rem',
    marginTop: theme.spacing(1),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 50,
  },
}));

const TextFilePreview = styled('div')(({ theme }) => ({
  width: 50,
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginRight: theme.spacing(1),
  fontSize: '0.875rem',
  color: theme.palette.grey[500],
  '& .file-name': {
    fontSize: '0.75rem',
    marginTop: theme.spacing(1),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 50,
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  padding: 0,
  right: 3,
  top: -8,
  zIndex: 1,
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.background.paper,
  },
  borderRadius: '50%',
}));

interface PromptProps {
  elem: PromptElem;
  onClickSend: (el: PromptElem) => void;
  onClear: () => void;
  sendDisabled: boolean;
  showClear: boolean;
  visionDisabled: boolean;
}

// Do not render the send button when it is disabled. Do not render the start recording button if audio data exists.
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
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

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

  const handlePaste = async (items: DataTransferItemList | File[]) => {
    const newFiles: File[] = [];
    for (const item of items) {
      if (newFiles.length + files.length >= MAX_FILES) break; // Limit the total number of files
      const file = item instanceof File ? item : item.getAsFile();
      if (!file) continue;
      newFiles.push(file);
    }
    await handleFileUpload(newFiles);
  };

  let textTypes = 'application/pdf,application/json,text/*,.ts*,.js*,.md';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioData(base64Audio);
          setText(''); // Clear text when audio is recorded
        };
        reader.readAsDataURL(audioBlob);
      });

      mediaRecorder.start();
      setIsRecording(true);
      setText(''); // Clear text when starting to record
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
              <DeleteButton
                size="medium"
                onClick={() => handleDeleteFile(index)}
              >
                <Cancel fontSize="medium" />
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
              <DeleteButton size="medium" onClick={handleDeleteAudio}>
                <Cancel fontSize="medium" />
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
          onPaste: async (event) => {
            if (!isTextInputDisabled) {
              await handlePaste(event.clipboardData.items);
            }
          },
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
              {!isAnsweredReply && (
                <IconButton
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <Stop /> : <Mic />}
                </IconButton>
              )}
              {!isAnsweredReply && (
                <IconButton
                  disabled={sendDisabled || (!text && !audioData)}
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
