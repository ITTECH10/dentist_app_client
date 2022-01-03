import { useState } from 'react'
import axios from 'axios'
import { useApp } from './../../../context/AppContext'

import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import {
    Stack,
    TextField,
    Link
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
    const { setGeneralAlertOptions } = useApp()
    const [btnLoading, setBtnLoading] = useState(false)

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().email('Email adresa mora biti validna.').required('Molimo vas unesite vašu email adresu.'),
    });

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: ForgotPasswordSchema,
        onSubmit: () => {
            setBtnLoading(true)
            axios.post('/employees/forgotPassword', { ...values })
                .then(res => {
                    if (res.status === 200) {
                        setBtnLoading(false)
                        setGeneralAlertOptions({
                            open: true,
                            severity: 'success',
                            message: 'Poslali smo vam instrukcije za resetovanje lozinke na vaš E-mail.!',
                            hideAfter: 5000
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    setBtnLoading(false)
                })
        }
    });

    const { errors, touched, values, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        type="email"
                        sx={{ mb: 2 }}
                        label="E-mail"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />
                </Stack>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={btnLoading}
                >
                    Gotovo
                </LoadingButton>
                <Link sx={{ display: 'inline-block', mt: .5 }} variant="subtitle2" component={RouterLink} to="/login">
                    Vrati se nazad
                </Link>
            </Form>
        </FormikProvider>
    );
}
