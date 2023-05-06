import { Box, Button, Typography } from "@mui/material";
import * as React from "react";
import { t } from "i18next";

interface Params {
  requestsNum: number;
  costUSD: number;
  costUAH: number;
  onClickYes: () => void;
  onClickNo: () => void;
}

export function YesNoOverlay({
  requestsNum,
  costUSD,
  costUAH,
  onClickYes,
  onClickNo,
}: Params) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "white", margin: 2, textAlign: "center" }}
      >
        {t("requestSummary", {
          requestsNum,
          costUSD: costUSD.toFixed(4),
          costUAH: costUAH.toFixed(2),
        })}
        <br />
        {t("topUpQuestion")}
      </Typography>
      <Box sx={{ position: "relative", marginBottom: 2 }}>
        <img
          src="https://www.meme-arsenal.com/memes/c4b2ecc13589b720ebd8d5b34f8d328f.jpg"
          alt="Difficult choice meme"
          style={{ maxWidth: "375px" }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "50px",
            top: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "black",
              marginBottom: 1,
              position: "relative",
              left: "-12px",
              top: "-5px",
            }}
          >
            {t("yes")}
          </Typography>
          <Button
            className={"pulsate"}
            variant="contained"
            sx={{
              height: 23,
              width: 26,
              minWidth: 26,
              padding: 0,
              borderRadius: "50%",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              opacity: 0.5,
            }}
            onClick={() => {
              // @ts-expect-error external gtag
              gtag("event", "click", {
                event_category: "yes_no_overlay",
                event_action: "Click",
                event_label: "Yes",
              });
              onClickYes();
            }}
          ></Button>
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: "113px",
            top: "22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              color: "black",
              position: "relative",
              left: "-12px",
              top: "-4px",
            }}
          >
            {t("no")}
          </Typography>
          <Button
            className={"pulsate"}
            variant="contained"
            sx={{
              height: 22,
              width: 20,
              minWidth: 20,
              padding: 0,
              borderRadius: "50%",
              backgroundColor: "black",
              transform: "translateY(-50%)",
              opacity: 0.5,
            }}
            onClick={() => {
              // @ts-expect-error external gtag
              gtag("event", "click", {
                event_category: "yes_no_overlay",
                event_action: "Click",
                event_label: "No",
              });

              onClickNo();
            }}
          ></Button>
        </Box>
      </Box>
    </Box>
  );
}
