export async function handleImage(file: File): Promise<string> {
  try {
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          let scaleDownFactor = 1;
          const resizeAndCheck = () => {
            const targetWidth = img.width * scaleDownFactor;
            const targetHeight = img.height * scaleDownFactor;

            // Create a canvas to draw the scaled image
            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Convert the canvas to a data URL and check size
            const imageDataURL = canvas.toDataURL("image/jpeg");
            const byteString = atob(imageDataURL.split(",")[1]);
            const byteStringLength = byteString.length;
            console.log("SIZE", byteStringLength);
            if (byteStringLength > 3145728) {
              // More than 3 MB
              scaleDownFactor *= 0.75; // Reduce size by 25%
              console.log("SIZE REDUCED 10%");
              resizeAndCheck(); // Recursive call
            } else {
              resolve(imageDataURL);
            }
          };
          resizeAndCheck();
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error handling image:", error);
    throw error;
  }
}

export async function handlePDF(file: File): Promise<string> {
  const reader = new FileReader();
  const arrayBuffer = await new Promise((resolve, reject) => {
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsArrayBuffer(file);
  });

  const typedArray = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
  let texts = "";

  for (let num = 1; num <= pdf.numPages; num++) {
    const page = await pdf.getPage(num);
    const textContent = await page.getTextContent();
    textContent.items.forEach((item) => (texts += item.str + " "));
  }

  return `${file.name.toUpperCase()}:\n\`\`\`\n${texts.trim()}\n\`\`\``;
}
