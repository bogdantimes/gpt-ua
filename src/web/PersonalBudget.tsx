import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { t } from "i18next";

export interface PersonalBudgetProps {
  value: number;
  children?: React.ReactNode;
}

export function PersonalBudget({ value, children }: PersonalBudgetProps) {
  const theme = useTheme();

  return (
    <Box sx={{ minWidth: "150px", position: "relative" }}>
      <Typography variant="h5" marginBottom={"10px"} align={"center"}>
        {t("budget.personal")}
      </Typography>
      <Typography variant={"h4"} color={theme.palette.primary.main}>
        {`$${value.toFixed(2)}`}
      </Typography>
      {children}
    </Box>
  );
}
