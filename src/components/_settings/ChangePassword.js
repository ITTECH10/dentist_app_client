import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import axios from 'axios'
/////////////////////////////
import { Paper, Typography, Box, Button, TextField, Stack, CircularProgress } from '@mui/material'
import KeyIcon from '@mui/icons-material/Key';

/////////////////////////////
import { generatePassword } from '../../utils/generatePassword'

const initialFields = {
    currentPassword: '',
    password: '',
    confirmPassword: ''
}

const ChangePassword = () => {
    const { setGeneralAlertOptions } = useApp()
    const [passwordInputType, setPasswordInputType] = useState('password')
    const [fields, setFields] = useState(initialFields)
    const [btnLoading, setBtnLoading] = useState(false)

    const passwordGenerationHandler = () => {
        setPasswordInputType('text')
        const generatedPassword = generatePassword()
        setFields({
            ...fields,
            password: generatedPassword,
            confirmPassword: generatedPassword
        })
    }

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

        if (fields.password !== fields.confirmPassword) {
            setBtnLoading(false)
            setGeneralAlertOptions({
                open: true,
                severity: 'error',
                message: 'Nova lozinka i potvrđena se ne podudaraju!',
                hideAfter: 5000
            })
            return
        }

        if (fields.password.length < 8) {
            setBtnLoading(false)
            setGeneralAlertOptions({
                open: true,
                severity: 'error',
                message: 'Lozinka mora sadržavati minimalno 8 znakova!',
                hideAfter: 5000
            })
            return
        }

        axios.put('/employees/updateMyPassword', { ...fields })
            .then(res => {
                if (res.status === 200) {
                    setBtnLoading(false)
                    setFields(initialFields)
                    setGeneralAlertOptions({
                        open: true,
                        severity: 'success',
                        message: 'Uspješno ste promjenili lozinku!',
                        hideAfter: 5000
                    })
                }
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" mb={2}>
                Promjenite Lozinku
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        id="current-pwd-settings"
                        name="currentPassword"
                        label="Trenutna Lozinka"
                        type={passwordInputType}
                        fullWidth
                        size="small"
                        value={fields.currentPassword}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        id="new-pwd-settings"
                        name="password"
                        label="Nova Lozinka"
                        type={passwordInputType}
                        fullWidth
                        size="small"
                        value={fields.password}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        id="confirm-pwd-settings"
                        name="confirmPassword"
                        label="Potvrdite Lozinku"
                        type={passwordInputType}
                        fullWidth
                        size="small"
                        value={fields.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Stack>
                <Box mt={1}>
                    <Typography variant="subtitle1">
                        Kriterijum za novu lozinku
                    </Typography>

                    <Box ml={2}>
                        <Typography
                            variant="caption"
                            sx={{ display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside' }}
                        >
                            Minimalno 8 znakova, što više to bolje.
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside' }}
                        >
                            Koristite znakove poput (*,!.?%)
                        </Typography>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1} mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={Object.values(fields).some(el => el === '')}
                    >
                        {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<KeyIcon />}
                        onClick={() => passwordGenerationHandler()}
                    >
                        Automatska Lozinka
                    </Button>
                </Stack>
            </Box>
        </Paper>
    )
}

export default ChangePassword
