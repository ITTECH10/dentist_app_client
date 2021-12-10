import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function AddAppointmentModal() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <EventNoteIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Novi Termin</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novi termin, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <TextField
                        id="date"
                        label="Datum"
                        type="date"
                        sx={{ mt: 2 }}
                        fullWidth
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                    <Button variant="contained" color="primary" onClick={handleClose}>Gotovo</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
