import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthenticated, setToken } = useApp()
  const [btnLoading, setBtnLoading] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Molimo vas unesite validnu E-mail adresu.').required('Molimo vas unesite vaš E-mail.'),
    password: Yup.string().required('Molimo vas unesite vašu lozinku.')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      setBtnLoading(true)
      axios.post('/employees/login', { ...values })
        .then(res => {
          if (res.status === 200) {
            setBtnLoading(false)
            setAuthenticated(true);
            navigate('/dashboard/app')
            // localStorage.setItem('token', JSON.stringify(res.data.token))
            setToken(res.data.token)
          }
        }).catch(err => {
          console.log(err)
          setBtnLoading(false)
        })
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Lozinka"
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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Zapamti me"
          />

          <Link component={RouterLink} variant="subtitle2" to="/forgotPassword">
            Zaboravili ste lozinku?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={btnLoading}
        >
          Prijava
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
