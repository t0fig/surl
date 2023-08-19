import React, {useState} from 'react';
import {Alert, Button, Snackbar} from '@mui/material';


function CopyButton({text}) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(text).then(() => setSnackbarOpen(true));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleCopyClick} sx={{marginLeft: '2vw'}}>
                Copy
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
                    URL copied to clipboard!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CopyButton;
