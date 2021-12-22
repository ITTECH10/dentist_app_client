import * as React from 'react';
import { useApp } from '../../context/AppContext'
import { useEmployeeContext } from '../../context/EmployeeContext'
import axios from 'axios'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import KeyIcon from '@mui/icons-material/Key';

import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { generatePassword } from '../../utils/generatePassword'

const workRoles = [
    {
        id: 1,
        text: "Direktor",
        value: 'director'
    },
    {
        id: 2,
        text: "Zamjenik",
        value: 'deputy'
    },
    {
        id: 3,
        text: "Asistent",
        value: 'assistant'
    },
]

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
    gender: genders[0].value,
    role: workRoles[0].value,
    phone: '',
    email: '',
    password: '',
    employeeImage: ''
}

export default function AddEmployeeDialog({ onlyIcon }) {
    const [open, setOpen] = React.useState(false)
    const [passwordInputType, setPasswordInputType] = React.useState('password')
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { setGeneralAlertOptions } = useApp()
    const { employees, setEmployees } = useEmployeeContext()
    const [fields, setFields] = React.useState(initialFields)

    const formData = new FormData()
    formData.append('firstName', fields.firstName)
    formData.append('lastName', fields.lastName)
    formData.append('birthDate', fields.birthDate)
    formData.append('gender', fields.gender)
    formData.append('role', fields.role)
    formData.append('phone', fields.phone)
    formData.append('email', fields.email)
    formData.append('password', fields.password)
    formData.append('photo', fields.employeeImage)

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

    const handleSubmit = e => {
        e.preventDefault()
        setBtnLoading(true)

        axios({
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            url: '/employees/signup',
            data: formData
        }).then(res => {
            if (res.status === 201) {
                const updatedEmployees = [...employees, { ...res.data.newEmployee }]

                setEmployees(updatedEmployees)
                setOpen(false)
                setBtnLoading(false)
                setGeneralAlertOptions({
                    open: true,
                    message: `Uspješno ste dodali zaposlenika! 
                            Molimo vas proslijedite lozinku i email novom zaposleniku!
                            Email: ${fields.email}
                            Lozinka: ${fields.password}
                            `,
                    severity: 'info',
                    hideAfter: 60000
                })
            }
        }).catch(err => {
            console.log(err)
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

    const handleUploadBoxOpening = () => {
        const input = document.getElementById('upload-employee-photo')
        input.click()
    }

    const handleImageSelection = (e) => {
        const photo = e.target.files[0]
        setFields({
            ...fields,
            employeeImage: photo
        })
    }

    return (
        <>
            {onlyIcon ?
                <BusinessCenterIcon onClick={handleClickOpen} />
                : <Button
                    variant="contained"
                    startIcon={<Icon icon={plusFill} />}
                    onClick={handleClickOpen}
                >
                    Novi Zaposlenik
                </Button>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Novi Zaposlenik</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novog zaposlenika, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            id="upload-employee-photo"
                            name="employeeImage"
                            type="file"
                            onChange={handleImageSelection}
                            hidden
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleUploadBoxOpening}
                        >
                            {fields.employeeImage !== '' ? 'Promjeni sliku' : 'Dodaj sliku'}
                        </Button>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="firstName"
                            name="firstName"
                            label="Ime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            id="lastName"
                            name="lastName"
                            label="Prezime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            id="birthDate"
                            name="birthDate"
                            label="Datum rođenja"
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
                            id="standard-select-gender"
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
                            {genders.map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            name="role"
                            id="standard-select-workRole"
                            select
                            label="Radno Mjesto"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                            required
                            sx={{ mt: 2 }}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {workRoles.map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            id="phone"
                            name="phone"
                            label="Telefon"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            id="input-with-icon-textfield"
                            name="password"
                            label="Password"
                            type={passwordInputType}
                            fullWidth
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
