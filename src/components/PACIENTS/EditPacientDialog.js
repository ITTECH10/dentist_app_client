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
import CircularProgress from '@mui/material/CircularProgress';
import editFill from '@iconify/icons-eva/edit-fill';
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'

import { Icon } from '@iconify/react';

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

export default function EditPacientDialog({ pacientId }) {
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

    // STARTING WITH SERVER APPROACH // NICE TO CONSIDER CLIENT APPROACH // OR OPPOSITE
    // ALREADY CONSIDERING TO TAKE THIS APPROACH
    const handleClickOpen = () => {
        setOpen(true);
        axios(`/pacients/${pacientId}`)
            .then(res => {
                if (res.status === 200) {
                    setFields(res.data.pacient)
                }
            }).catch(err => {
                console.log(err)
            })
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
            method: 'PUT',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            url: `/pacients/${pacientId}`
        }).then(res => {
            if (res.status === 200) {
                const updatedPacients = [...pacients]
                const updatingPacientIndex = updatedPacients.findIndex(pacient => pacient._id === pacientId)
                const foundPacient = updatedPacients[updatingPacientIndex]

                foundPacient.firstName = res.data.updatedPacient.firstName
                foundPacient.lastName = res.data.updatedPacient.lastName
                foundPacient.gender = res.data.updatedPacient.gender
                foundPacient.address = res.data.updatedPacient.address
                foundPacient.birthDate = res.data.updatedPacient.birthDate
                foundPacient.pacientImage = res.data.updatedPacient.pacientImage
                foundPacient.phone = res.data.updatedPacient.phone
                setPacients(updatedPacients)
                setBtnLoading(false)
                setOpen(false)
                setGeneralAlertOptions({
                    open: true,
                    message: 'Uspješno ste izmjenili informacije o pacijentu!',
                    severity: 'success',
                    hideAfter: 5000
                })
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
            <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
                <ListItemIcon>
                    <Icon icon={editFill} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Izmjeni" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Izmjena informacija o pacijentu</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste izmjenili informacije povezane sa ovim pacijentom,
                        molimo vas ispunite formu ispod.
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
                            {/* {fields.pacientImage !== '' ? 'Slika je dodana' : 'Nova slika'} */}
                            Nova slika
                        </Button>
                        <TextField
                            name="firstName"
                            autoFocus
                            margin="dense"
                            id="firstName"
                            label="Ime"
                            placeholder={fields.firstName}
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="lastName"
                            id="lastName"
                            label="Prezime"
                            placeholder={fields.lastName}
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="address"
                            id="address"
                            placeholder={fields.address}
                            label="Adresa"
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
                            margin="dense"
                            id="phone"
                            label="Telefon"
                            placeholder={fields.phone}
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
                            // disabled={Object.values(fields).some(field => field === '')}
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
