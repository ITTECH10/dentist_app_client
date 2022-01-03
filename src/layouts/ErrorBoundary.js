import React from 'react'
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10)
}));

// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    autoReloadAfter() {
        if (this.state.hasError) {
            setTimeout(() => {
                window.location.reload()
            }, 5000)
        }
    }

    componentDidUpdate() {
        this.autoReloadAfter()
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    render() {
        if (this.state.hasError) {
            return (
                <RootStyle title="404 Page Not Found | Minimal-UI">
                    <Container>
                        <MotionContainer initial="initial" open>
                            <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                                <motion.div variants={varBounceIn}>
                                    <Typography variant="h3" paragraph>
                                        Oops!
                                    </Typography>
                                </motion.div>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    Žao nam je, nešto je pošlo naopako, molimo vas sačekajte da
                                    se aplikacija ponovo učita, ili kontaktirajte korisničku podršku.
                                </Typography>

                                <motion.div variants={varBounceIn}>
                                    <Box
                                        component="img"
                                        src="/static/illustrations/something_wrong.jpg"
                                        sx={{ height: 280, width: 350, mx: 'auto' }}
                                    />
                                </motion.div>
                                {/* 
                                <Button to={authenticated ? '/dashboard/app' : '/login'} onClick={() => this.setState({ hasError: false })} size="large" variant="contained" component={RouterLink}>
                                    Početna stranica
                                </Button> */}
                            </Box>
                        </MotionContainer>
                    </Container>
                </RootStyle>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary