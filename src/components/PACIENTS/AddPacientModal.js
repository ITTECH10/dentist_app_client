import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const genders = [
    {
        id: 1,
        text: "Muško"
    },
    {
        id: 2,
        text: "Žensko"
    },
]

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
            <PersonAddIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Novi Pacijent</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novog pacijenta, molimo vas popunite informacije
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
                        label="Prezime"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="date"
                        label="Datum rođenja"
                        type="date"
                        sx={{ mt: 2 }}
                        fullWidth
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        name="gender"
                        id="standard-select-gender"
                        select
                        label="Spol"
                        fullWidth
                        variant="standard"
                        required
                        sx={{ mt: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {genders.map((option, idx) => (
                            <option key={option.id} value={option.text}>
                                {option.text}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Telefon"
                        type="tel"
                        fullWidth
                        variant="standard"
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
