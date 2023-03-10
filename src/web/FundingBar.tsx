import React from 'react';
import LinearProgress, {linearProgressClasses, LinearProgressProps} from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {t} from 'i18next';
import DonateButton from './DonateButton';

// Define the fundraising campaign counter component
export type FundraisingCounterProps = {
  value: number;
  target: number;
  onDonated: (amount: number) => void;
};

export function FundingBar({value, target, onDonated}: FundraisingCounterProps) {
  value = Math.min(target, value <= 0 ? 0 : +value.toFixed(2));
  const percentage = Math.round((value / target) * 100);
  const theme = useTheme();

  return (
    <Box sx={{minWidth: '150px', position: 'relative'}}>
      <Typography variant="h5" marginBottom={"-10px"} align={"center"}>{t('budget.remaining')}</Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant={"h5"}>{`$${value}`}</Typography>
        <Typography>{`$${target}`}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={percentage} sx={{
        mb: "15px",
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }
      }}/>
      <Typography align={"center"}>{t('budget.donate')}</Typography>
      <Box sx={{mt: "10px", display: 'flex', justifyContent: 'center'}}>
        <DonateButton onComplete={(params) => {
          onDonated(+params.amt)
        }}/>
      </Box>
    </Box>
  );
};
