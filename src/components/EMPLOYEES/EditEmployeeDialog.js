import * as React from 'react';
import { useEmployeeContext } from './../../context/EmployeeContext'
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
/////////////////////////////////////////

import { Icon } from '@iconify/react';
import { hasPermission, actions } from './../../utils/DataProviders/ROLES/permissions'

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

const initialFields = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    role: workRoles[0].value,
    gender: genders[0].value,
    phone: '',
    employeeImage: ''
}

export default function EditEmployeeDialog({ employeeId }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { setEmployees, employees, logedInEmployee } = useEmployeeContext()
    const { setGeneralAlertOptions } = useApp()
    const [fields, setFields] = React.useState(initialFields)
    const allowedEditing = hasPermission(logedInEmployee, actions.EDIT_EMPLOYEE)

    const formData = new FormData()
    formData.append('firstName', fields.firstName)
    formData.append('lastName', fields.lastName)
    formData.append('birthDate', fields.birthDate)
    formData.append('email', fields.email)
    formData.append('role', fields.role)
    formData.append('gender', fields.gender)
    formData.append('phone', fields.phone)
    formData.append('photo', fields.employeeImage)

    // STARTING WITH SERVER APPROACH // NICE TO CONSIDER CLIENT APPROACH // OR OPPOSITE
    // ALREADY CONSIDERING TO TAKE THIS APPROACH
    const handleClickOpen = () => {
        setOpen(true);
        axios(`/employees/${employeeId}`)
            .then(res => {
                if (res.status === 200) {
                    setFields(res.data.employee)
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
            url: `/employees/${employeeId}`
        }).then(res => {
            if (res.status === 200) {
                const updatedEmployees = [...employees]
                const updatingEmployeeIndex = updatedEmployees.findIndex(employee => employee._id === employeeId)
                const foundEmployee = updatedEmployees[updatingEmployeeIndex]

                // CHECK IF THE EMPLOYEE BEEING EDITED IS THE CURRENTLY LOGED IN EMPLOYEE
                if (logedInEmployee._id === res.data.updatedEmployee._id) {
                    logedInEmployee.employeeImage = res.data.updatedEmployee.employeeImage
                }

                foundEmployee.firstName = res.data.updatedEmployee.firstName
                foundEmployee.lastName = res.data.updatedEmployee.lastName
                foundEmployee.gender = res.data.updatedEmployee.gender
                foundEmployee.role = res.data.updatedEmployee.role
                foundEmployee.birthDate = res.data.updatedEmployee.birthDate
                foundEmployee.employeeImage = res.data.updatedEmployee.employeeImage
                foundEmployee.phone = res.data.updatedEmployee.phone
                foundEmployee.email = res.data.updatedEmployee.email
                setEmployees(updatedEmployees)
                setBtnLoading(false)
                setOpen(false)
                setGeneralAlertOptions({
                    open: true,
                    message: 'Uspješno ste izmjenili informacije o zaposleniku!',
                    severity: 'success',
                    hideAfter: 5000
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const openUploadHandler = () => {
        const input = document.getElementById('upload-employee-photo')
        input.click()
    }

    const handleImageChange = (e) => {
        const photo = e.target.files[0]
        setFields({
            ...fields,
            employeeImage: photo
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
                <DialogTitle>Izmjenite informacije o zaposleniku</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste izmjenili informacije povezane sa ovim zaposlenikom,
                        molimo vas ispunite formu ispod.
                    </DialogContentText>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            id="upload-employee-photo"
                            name="employeeImage"
                            type="file"
                            onChange={handleImageChange}
                            hidden
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={openUploadHandler}
                        >
                            Nova slika
                        </Button>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="firstName"
                            name="firstName"
                            placeholder={fields.firstName}
                            label="Ime"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            id="lastName"
                            name="lastName"
                            placeholder={fields.lastName}
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
                            disabled={!allowedEditing}
                            variant="standard"
                            onChange={handleChange}
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
                            placeholder={fields.phone}
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            placeholder={fields.email}
                            label="Email"
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
