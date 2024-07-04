import React from 'react';
import { ButtonGroup, Button, Chip, Badge, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { t } from 'i18next';
import { CheckCircleOutline, HelpOutline, Settings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  fontSize: '0.7rem',
  height: '20px',
}));

const ModeSelector = ({
  ChatModes,
  mode,
  setMode,
  onSettingsClick,
  showCheck,
}) => {
  const theme = useTheme();
  return (
    <ButtonGroup
      sx={{ 'flex-wrap': 'wrap', 'justify-content': 'center' }}
      size={'small'}
      color="primary"
      aria-label="outlined primary button group"
    >
      {ChatModes.map((m) => (
        <Button
          key={m}
          variant={mode === m ? 'contained' : 'outlined'}
          onClick={() => {
            setMode(m);
          }}
          sx={{ position: 'relative' }}
        >
          {t(`mode.${m}`)}
          {m === 'llama' && (
            <StyledChip label="Free" color="success" size="small" />
          )}
          {m === 'claude3_5' && (
            <StyledChip label="New" color="info" size="small" />
          )}
        </Button>
      ))}
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        badgeContent={
          showCheck ? (
            <CheckCircleOutline
              sx={{
                fontSize: '1rem',
                color: theme.palette.success.main,
              }}
            />
          ) : (
            <HelpOutline
              className={'pulsate'}
              sx={{
                fontSize: '1rem',
                color: theme.palette.info.main,
              }}
            />
          )
        }
      >
        <IconButton onClick={onSettingsClick}>
          <Settings />
        </IconButton>
      </Badge>
    </ButtonGroup>
  );
};

export default ModeSelector;
