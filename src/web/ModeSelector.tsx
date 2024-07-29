import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, Chip, Badge, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { t } from 'i18next';
import { CheckCircleOutline, HelpOutline, Settings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ChatModeConfig, ChatMode } from './Types';

const StyledChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  fontSize: '0.7rem',
  height: '20px',
}));

interface ModeSelectorProps {
  modes: ChatModeConfig[];
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  onSettingsClick: () => void;
  showCheck: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  modes,
  mode,
  setMode,
  onSettingsClick,
  showCheck,
}) => {
  const theme = useTheme();
  const [showFree, setShowFree] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFree((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ButtonGroup
      sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      size="small"
      color="primary"
      aria-label="outlined primary button group"
    >
      {modes.map((modeConfig) => (
        <Button
          key={modeConfig.id}
          variant={mode === modeConfig.id ? 'contained' : 'outlined'}
          onClick={() => {
            setMode(modeConfig.id);
          }}
          sx={{ position: 'relative' }}
        >
          {t(`mode.${modeConfig.id}`)}
          {modeConfig.isFree && modeConfig.isNew ? (
            showFree ? (
              <StyledChip label="Free" color="success" size="small" />
            ) : (
              <StyledChip label="New" color="info" size="small" />
            )
          ) : modeConfig.isFree ? (
            <StyledChip label="Free" color="success" size="small" />
          ) : modeConfig.isNew ? (
            <StyledChip label="New" color="info" size="small" />
          ) : null}
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
              className="pulsate"
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
