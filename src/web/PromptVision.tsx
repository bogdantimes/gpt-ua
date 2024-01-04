import * as React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import { AddAPhoto, Cancel, Clear, Send } from "@mui/icons-material";
import { type PromptElem } from "./Types";
import { t } from "i18next";

// Styling the Paper component with MUI's styled API
const ImagePreview = styled("img")(({ theme }) => ({
  position: "absolute",
  left: -5, // Adjust for exact positioning
  top: "50%",
  transform: "translateY(-50%)",
  width: 40, // Set the width to 50px
  height: 40, // Set the height to 50px
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius * 2, // To match the TextField's border radius
  boxShadow: theme.shadows[3],
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  padding: 0,
  left: 24,
  top: -24,
  zIndex: 1,
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.background.paper,
  },
  borderRadius: "50%",
}));

const UploadIcon = styled(AddAPhoto)(({ theme }) => ({
  position: "absolute",
  left: 2,
  top: "50%",
  transform: "translateY(-50%)",
}));

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
  const [imageSrc, setImageSrc] = React.useState<string>(elem.getImage());
  const isStartPrompt = elem.getId() === 0;
  const isAnsweredReply = !isStartPrompt && elem.isAnswered();
  const label = isStartPrompt ? t("conversation.start") : t("conversation.you");

  const handlePaste = (items: DataTransferItemList | File[]) => {
    for (const item of items) {
      const file = item instanceof File ? item : item.getAsFile();
      console.log(file);
      if (
        file &&
        /^image\/(png|jpeg|webp|gif)$/.test(file.type) &&
        file.size <= 20971520
      ) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Create an image to read the dimensions
          const img = new Image();
          img.onload = () => {
            // Check if the image needs to be scaled down
            const scaleDown = 1024;
            if (img.width > scaleDown || img.height > scaleDown) {
              // Get the aspect ratio of the image
              const aspectRatio = img.width / img.height;
              let targetWidth = img.width;
              let targetHeight = img.height;

              // Calculate the target dimensions
              if (aspectRatio > 1) {
                // Image is wider than tall
                targetWidth = scaleDown;
                targetHeight = targetWidth / aspectRatio;
              } else {
                // Image is taller than wide
                targetHeight = scaleDown;
                targetWidth = targetHeight * aspectRatio;
              }

              // Create a canvas to draw the scaled image
              const canvas = document.createElement("canvas");
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

              // Convert the canvas to a data URL and set it as the image source
              const scaledImageDataURL = canvas.toDataURL(file.type);
              setImageSrc(scaledImageDataURL);
            } else {
              // If no scaling is needed, use the original image
              setImageSrc(e.target?.result as string);
            }
          };
          // Set the source of the image to the FileReader result
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteImage = () => {
    setImageSrc(""); // This will remove the image source and effectively delete the image preview
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <TextField
        id={`prompt-${elem.getId()}`}
        label={label}
        value={text}
        multiline
        fullWidth
        focused={isAnsweredReply ? false : undefined}
        onChange={(event) => {
          setText(event.target.value);
        }}
        helperText={!isAnsweredReply && "Ctrl+Enter"}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === "Enter") {
            elem.setText(text);
            elem.setImage(imageSrc);
            onClickSend(elem);
          }
        }}
        InputProps={{
          readOnly: isAnsweredReply,
          onPaste: (event) => {
            !visionDisabled && handlePaste(event.clipboardData.items);
          },
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  minWidth:
                    imageSrc || (!isAnsweredReply && !visionDisabled)
                      ? "40px"
                      : undefined,
                }}
              >
                {imageSrc && (
                  <Box position={"relative"}>
                    {!isAnsweredReply && (
                      <DeleteButton size="small" onClick={handleDeleteImage}>
                        <Cancel fontSize="small" />
                      </DeleteButton>
                    )}
                    <ImagePreview src={imageSrc} alt="Pasted" />
                  </Box>
                )}
                {!visionDisabled && !imageSrc && !isAnsweredReply && (
                  <Box sx={{ mt: "-4px" }}>
                    <input
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      type="file"
                      onChange={(event) => {
                        handlePaste(event.target.files);
                      }}
                    />
                    <label htmlFor="raised-button-file">
                      <IconButton component={"span"}>
                        <UploadIcon />
                      </IconButton>
                    </label>
                  </Box>
                )}
              </Box>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isStartPrompt && (text || showClear) && (
                <IconButton
                  onClick={() => {
                    setText("");
                    onClear();
                    setImageSrc("");
                  }}
                >
                  <Clear />
                </IconButton>
              )}
              {!isAnsweredReply && (
                <IconButton
                  disabled={sendDisabled}
                  onClick={() => {
                    elem.setText(text);
                    elem.setImage(imageSrc);
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
