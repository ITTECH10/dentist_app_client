import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import axios from 'axios'
import { useApp } from './../../../context/AppContext'

// material
import {
    Link,
    Stack,
    Checkbox,
    TextField,
    IconButton,
    InputAdornment,
    FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false);
    const { setToken } = useApp()

    const urlToken = location.pathname.split('/')[2]

    const LoginSchema = Yup.object().shape({
        password: Yup.string().required('Molimo vas unesite vašu novu lozinku.').oneOf([Yup.ref('confirmPassword'), null], 'Lozinke se ne podudaraju!'),
        confirmPassword: Yup.string().required('Molimo vas potvrdite vašu lozinku.').oneOf([Yup.ref('password'), null], 'Lozinke se ne podudaraju!')
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: LoginSchema,

        onSubmit: () => {
            if (values.password !== values.confirmPassword) return
            axios.post(`/employees/resetPassword/${urlToken}`, { password: values.password })
                .then(res => {
                    if (res.status === 200) {
                        setToken(res.data.token)
                        navigate('/dashboard/app')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={1}>
                    <TextField
                        fullWidth
                        sx={{ mb: 0 }}
                        autoComplete="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Nova Lozinka"
                        {...getFieldProps('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />
                    <TextField
                        fullWidth
                        style={{ marginBottom: 8 }}
                        autoComplete="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        label="Potvrdite lozinku"
                        {...getFieldProps('confirmPassword')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                </Stack>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Gotovo
                </LoadingButton>
            </Form>
        </FormikProvider>
    );
}
