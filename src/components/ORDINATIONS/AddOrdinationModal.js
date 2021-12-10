import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

export default function AddPacientModal() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AddBusinessIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nova Ordinacija</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novu ordinaciju, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Ime"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Mjesto"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="date"
                        label="Datum osnivanja"
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
