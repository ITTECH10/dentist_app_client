import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useEmployeeContext } from '../../context/EmployeeContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
///////////////////////////////////
import { Paper, Typography, Stack, Button, Box, TextField, CircularProgress } from '@mui/material'
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
///////////////////////////////////
import { manipulateCloudinaryImage } from '../../utils/manipulateCloudinaryImage'

const initialValues = {
    employeeImage: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    phone: '',
    birthDate: '',
}

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

const handleUploadBoxOpening = () => {
    const input = document.getElementById('upload-employee-photo-settings')
    input.click()
}

const EditMyProfileForm = () => {
    const [fields, setFields] = useState(initialValues)
    const { setGeneralAlertOptions } = useApp()
    const { logedInEmployee, setLogedInEmployee, setEmployees, employees } = useEmployeeContext()
    const { employeeImage: image, _id, firstName, lastName, email, phone, gender, birthDate: employeeBirthDate } = logedInEmployee
    const manipulatedEmployeeImage = manipulateCloudinaryImage(image)
    const [btnLoading, setBtnLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault()
        setBtnLoading(true)

        axios({
            method: 'PUT',
            data: formData,
            url: `/employees/${_id}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) {
                // UPDATE EMPLOYEE IMAGE // TODO
                const employeesCopy = [...employees]
                const updatingEmployee = employeesCopy.find(employee => employee._id === _id)
                updatingEmployee.employeeImage = res.data.updatedEmployee.employeeImage

                setEmployees(employeesCopy)
                setLogedInEmployee(res.data.updatedEmployee)
                setBtnLoading(false)
                setGeneralAlertOptions({
                    open: true,
                    severity: 'success',
                    message: 'Uspješno ste ažurirali sopstvene informacije!',
                    hideAfter: 5000
                })

                setFields({ ...initialValues, gender: res.data.updatedEmployee.gender })
            }
        }).catch(err => {
            console.log(err)
            setBtnLoading(false)
        })
    }
    const handleChange = e => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const formData = new FormData()
    formData.append('photo', fields.employeeImage)
    formData.append('firstName', fields.firstName)
    formData.append('lastName', fields.lastName)
    formData.append('gender', fields.gender)
    formData.append('phone', String(fields.phone))
    formData.append('birthDate', fields.birthDate)

    return (
        <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" mb={2}>
                Izmjenite informacije na vašem profilu:
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ height: 65, width: 65, position: 'relative' }}>
                    <img src={manipulatedEmployeeImage} alt="employee-profile" style={{ height: '100%', width: '100%', borderRadius: '50%' }} />
                    <Button onClick={handleUploadBoxOpening} sx={{ position: 'absolute', top: '85%', right: '-35%', p: 0, height: 0, width: 0 }} variant="text" startIcon={<PhotoCameraIcon />} />
                </Box>
                <Typography>{`${firstName} ${lastName}`}</Typography>
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box component="form" onSubmit={handleSubmit}>
                    <input
                        id="upload-employee-photo-settings"
                        name="employeeImage"
                        type="file"
                        onChange={(e) => setFields({ ...fields, employeeImage: e.target.files[0] })}
                        hidden
                    />
                    <Stack direction="row" spacing={2} mt={3}>
                        <TextField
                            placeholder={`Ime: ${firstName}`}
                            name="firstName"
                            fullWidth
                            size="small"
                            value={fields.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            placeholder={`Prezime: ${lastName}`}
                            fullWidth
                            name="lastName"
                            size="small"
                            value={fields.lastName}
                            onChange={handleChange}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} mt={3}>
                        <TextField
                            fullWidth
                            name="email"
                            size="small"
                            disabled
                            autoComplete="username"
                            type="email"
                            label={`Email: ${email}`}
                            value={fields.email}
                            onChange={handleChange}
                        />
                        <DateTimePicker
                            label="Datum Rođenja"
                            name="date"
                            value={employeeBirthDate}
                            ampm={false}
                            onChange={(value) => setFields({ ...fields, birthDate: value })}
                            renderInput={(params) => <TextField size="small" fullWidth {...params} />}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} mt={3}>
                        <TextField
                            name="gender"
                            select
                            label="Spol"
                            fullWidth
                            size="small"
                            value={fields.gender}
                            onChange={handleChange}
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
                            placeholder={`Telefon: ${phone}`}
                            fullWidth
                            size="small"
                            name="phone"
                            value={fields.phone}
                            onChange={handleChange}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1} mt={3}>
                        <Button variant="contained" color="error" onClick={() => navigate('/dashboard/app')}>Nazad</Button>
                        <Button variant="contained" type="submit" disabled={Object.values(fields).every(el => el === '')}>
                            {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                        </Button>
                    </Stack>
                </Box>
            </LocalizationProvider>
        </Paper>
    )
}

export default EditMyProfileForm
