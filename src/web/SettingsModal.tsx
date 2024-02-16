import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { t } from "i18next";

export function SettingsModal({ customInstructions, open, onClose, onSave }) {
  const [_customInstructions, setCustomInstructions] =
    useState(customInstructions);

  const handleSave = () => {
    onSave(_customInstructions);
    onClose(); // Close the modal after saving
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("settings.title")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={!_customInstructions}
          label={t("settings.label")}
          margin="dense"
          fullWidth
          value={_customInstructions}
          multiline
          rows={5}
          onChange={(e) => {
            setCustomInstructions(e.target.value);
          }}
          helperText={t("settings.helper")}
          placeholder={t("settings.placeholder")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleSave}>{t("save")}</Button>
      </DialogActions>
    </Dialog>
  );
}
