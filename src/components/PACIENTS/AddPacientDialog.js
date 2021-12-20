import * as React from 'react';
import { usePacientContext } from '../../context/PacientContext'
import { useApp } from '../../context/AppContext'
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
/////////////////////////////////////
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

const genders = [
    {
        id: 1,
        text: "Muško",
        value: 'male'
    },
    {
        id: 2,
        text: "Žensko",
        value: 'female'
    },
]

const initialFields = {
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    gender: genders[0].value,
    phone: '',
    pacientImage: ''
}

export default function AddPacientModal({ onlyIcon }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { setPacients, pacients } = usePacientContext()
    const { setGeneralAlertOptions } = useApp()
    const [fields, setFields] = React.useState(initialFields)

    const formData = new FormData()
    formData.append('firstName', fields.firstName)
    formData.append('lastName', fields.lastName)
    formData.append('birthDate', fields.birthDate)
    formData.append('address', fields.address)
    formData.append('gender', fields.gender)
    formData.append('phone', fields.phone)
    formData.append('photo', fields.pacientImage)

    let addPacientTimeout
    React.useEffect(() => {
        return () => {
            clearTimeout(addPacientTimeout)
        }
    }, [addPacientTimeout])

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

        axios({
            method: 'POST',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            url: '/pacients'
        }).then(res => {
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
                }, 1000)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const openUploadHandler = () => {
        const input = document.getElementById('photo-input-ref')
        input.click()
    }

    const handleImageChange = (e) => {
        const photo = e.target.files[0]
        setFields({
            ...fields,
            pacientImage: photo
        })
    }

    return (
        <>
            {onlyIcon ?
                <PersonAddIcon onClick={handleClickOpen} />
                : <Button
                    variant="contained"
                    startIcon={<Icon icon={plusFill} />}
                    onClick={handleClickOpen}
                >
                    Novi Pacijent
                </Button>
            }
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
                        <input
                            name="photo"
                            id="photo-input-ref"
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 1 }}
                            onClick={openUploadHandler}
                        >
                            {fields.pacientImage !== '' ? 'Promjeni sliku' : 'Dodaj sliku'}
                        </Button>
                        <TextField
                            name="firstName"
                            required
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
                            required
                            id="lastName"
                            label="Prezime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="address"
                            required
                            id="address"
                            label="Adresa"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            id="birthDate"
                            label="Datum rođenja"
                            name="birthDate"
                            required
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
                            required
                            id="gender"
                            select
                            label="Spol"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {genders.map((option, idx) => (
                                <option key={option.id} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            name="phone"
                            required
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
