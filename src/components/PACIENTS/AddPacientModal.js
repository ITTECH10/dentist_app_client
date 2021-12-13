import * as React from 'react';
import { usePacientContext } from './../../context/PacientContext'
import { useApp } from './../../context/AppContext'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CircularProgress from '@mui/material/CircularProgress';

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

const initialFields = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    phone: '',
}

export default function AddPacientModal() {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { setPacients, pacients } = usePacientContext()
    const { setGeneralAlertOptions } = useApp()
    const [fields, setFields] = React.useState(initialFields)

    let addPacientTimeout
    React.useEffect(() => {
        return () => {
            clearTimeout(addPacientTimeout)
        }
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFields(initialFields)
    };

    const handleChange = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnLoading(true)

        axios.post('/pacients', { ...fields })
            .then(res => {
                if (res.status === 201) {
                    const updatedPacients = [...pacients, { ...res.data.pacient }]
                    addPacientTimeout = setTimeout(() => {
                        setPacients(updatedPacients)
                        setBtnLoading(false)
                        setOpen(false)
                        setGeneralAlertOptions({
                            open: true,
                            message: 'Uspješno ste dodali pacijenta!',
                            severity: 'success',
                            hideAfter: 5000
                        })
                    }, 2000)
                }
            }).catch(err => {
                console.log(err)
            })
    }

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
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            name="firstName"
                            autoFocus
                            margin="dense"
                            id="firstName"
                            label="Ime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="lastName"
                            id="lastName"
                            label="Prezime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            id="birthDate"
                            label="Datum rođenja"
                            name="birthDate"
                            type="date"
                            sx={{ mt: 2 }}
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            name="gender"
                            id="gender"
                            select
                            label="Spol"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
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
                            name="phone"
                            margin="dense"
                            id="phone"
                            label="Telefon"
                            type="tel"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={Object.values(fields).some(field => field === '')}
                            >
                                {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
