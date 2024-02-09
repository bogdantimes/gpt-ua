import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box, IconButton, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";

const ImageViewer = ({ src, alt }) => {
  // Function to handle image download
  const downloadImage = (event) => {
    event.stopPropagation(); // Prevents the modal from opening when clicking the download button
    // iOS devices do not support the download attribute fully, especially for images
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Open the image in a new tab/window
      window.open(src, '_blank');
    } else {
      // For other devices, proceed with the download process
      const element = document.createElement('a');
      element.href = src;
      element.download = 'downloadedImage'; // You can customize the file name here
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        textAlign: "center",
      }}
    >
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <Box sx={{ borderRadius: "5px" }}>
            <TransformComponent>
              <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "auto" }}
              />
            </TransformComponent>
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <IconButton onClick={downloadImage}>
                <Download color={"secondary"} fontSize={"large"}></Download>
              </IconButton>
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                overflowY: "auto",
                maxHeight: "20%", // Adjust as needed
                padding: "8px",
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none" /* IE and Edge */,
                "scrollbar-width": "none" /* Firefox */,
              }}
            >
              <Typography
                variant="body2"
                style={{ whiteSpace: "pre-wrap", cursor: "grab" }}
              >
                {alt}
              </Typography>
            </Box>
          </Box>
        )}
      </TransformWrapper>
    </Box>
  );
};

export default ImageViewer;
