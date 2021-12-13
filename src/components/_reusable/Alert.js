import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useApp } from './../../context/AppContext'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alerts() {
    const { generalAlertOptions, setGeneralAlertOptions } = useApp()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setGeneralAlertOptions(prevState => ({
            ...prevState,
            open: false
        }));
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                open={generalAlertOptions.open}
                onClose={handleClose}
                autoHideDuration={generalAlertOptions.hideAfter}
                style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
                <Alert onClose={handleClose} severity={generalAlertOptions.severity} sx={{ width: '100%' }}>
                    {generalAlertOptions.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
