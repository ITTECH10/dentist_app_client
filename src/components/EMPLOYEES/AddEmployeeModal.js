import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import KeyIcon from '@mui/icons-material/Key';
import { generatePassword } from './../../utils/generatePassword'

const workRoles = [
    {
        id: 1,
        text: "Tehničar"
    },
    {
        id: 2,
        text: "Pomoćnik"
    },
]

export default function AddAppointmentModal() {
    const [open, setOpen] = React.useState(false)
    const [passwordInputType, setPasswordInputType] = React.useState('password')

    const [fields, setFields] = React.useState({
        password: ''
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = e => {
        setPasswordInputType('password')
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const passwordGenerationHandler = () => {
        setPasswordInputType('text')
        const generatedPassword = generatePassword()
        setFields({
            ...fields,
            password: generatedPassword
        })
    }

    return (
        <>
            <BusinessCenterIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Novi Zaposlenik</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novog zaposlenika, molimo vas popunite informacije
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
                        label="Pozicija"
                        fullWidth
                        variant="standard"
                        required
                        sx={{ mt: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {workRoles.map((option, idx) => (
                            <option key={option.id} value={option.text}>
                                {option.text}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        id="input-with-icon-textfield"
                        name="password"
                        label="Password"
                        type={passwordInputType}
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="standard"
                        value={fields.password}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        endIcon={<KeyIcon />}
                        onClick={() => passwordGenerationHandler()}
                    >
                        Automatska Lozinka
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                    <Button variant="contained" color="primary" onClick={handleClose}>Gotovo</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
