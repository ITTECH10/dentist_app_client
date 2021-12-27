import React from 'react'
import Page from '../components/Page';
import { Container, Stack, Typography } from '@mui/material'
import OrdinationList from './../components/ORDINATIONS/OrdinationList'

const Ordinations = () => {
    return (
        <Page title="Ordinacije">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Ordinacije
                    </Typography>
                </Stack>
                <OrdinationList />
            </Container>
        </Page>
    )
}

export default Ordinations
