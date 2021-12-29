// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';
// layouts
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import ForgotPasswordForm from '../components/authentication/login/ForgotPasswordForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ForgotPassword() {
    return (
        <RootStyle title="Zaboravili ste lozinku?">
            <MHidden width="mdDown">
                <SectionStyle>
                    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Zaboravili ste lozinku?
                    </Typography>
                    <img src="/static/illustrations/forgot_password.jpg" alt="reset your password" />
                </SectionStyle>
            </MHidden>

            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ my: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            Vaš Email...
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Ne brinite! Sve što je potrebno je da unesete E-mail
                            povezan sa vašim računom.</Typography>
                    </Stack>
                    <ForgotPasswordForm />
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
