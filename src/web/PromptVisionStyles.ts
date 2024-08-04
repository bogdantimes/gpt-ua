import { styled } from '@mui/material';

export const ImagePreview = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginRight: theme.spacing(2),
}));

export const AudioPreview = styled('div')(({ theme }) => ({
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

export const TextFilePreview = styled('div')(({ theme }) => ({
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

export const DeleteButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  padding: 0,
  right: 3,
  top: -8,
  zIndex: 1,
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.background.paper,
  },
  borderRadius: '50%',
}));
