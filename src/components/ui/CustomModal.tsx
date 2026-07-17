import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDirty?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDirty = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestClose = () => {
    if (isDirty) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const confirmDiscard = () => {
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={requestClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
        aria-labelledby="custom-modal-title"
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 3,
          },
        }}
      >
        <DialogTitle
          id="custom-modal-title"
          sx={{
            pr: 6,
            fontWeight: 700,
            borderBottom: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          {title}
          <IconButton
            aria-label="Zamknij"
            onClick={requestClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 2.5,
            pb: fullScreen ? 0 : 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="discard-changes-title"
      >
        <DialogTitle id="discard-changes-title">Odrzucić zmiany?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Masz niezapisane zmiany. Czy na pewno chcesz zamknąć formularz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Zostań
          </Button>
          <Button color="error" onClick={confirmDiscard} sx={{ textTransform: 'none' }} autoFocus>
            Odrzuć
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomModal;
