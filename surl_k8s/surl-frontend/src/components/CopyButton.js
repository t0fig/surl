import React, { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';

function CopyButton({ text }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyClick = () => {
    try {
      navigator.clipboard.writeText(text);
      setSnackbarOpen(true);
    } catch (error) {
      copyFallback(text);
      setSnackbarOpen(true);
    }
  };

  const copyFallback = (fallbackText) => {
    const textArea = document.createElement('textarea');
    textArea.value = fallbackText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleCopyClick} sx={{ marginLeft: '2vw' }}>
        Copy
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          URL copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CopyButton;

