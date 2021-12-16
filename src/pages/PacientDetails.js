import React from 'react'
import { usePacientContext } from './../context/PacientContext'
import { useLocation } from 'react-router-dom';
import Page from '../components/Page';
import { Container, Box, Card, Typography, Grid, Stack, Button } from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote';

/////////////////////////////
import PacientImageBox from './../components/PACIENTS/_details/PacientImageBox'
import PacientInfoBox from './../components/PACIENTS/_details/PacientInfoBox'
import PacientNavigation from './../components/PACIENTS/_details/PacientNavigation'
import DiagnosisEvidenceTable from './../components/PACIENTS/_details/DiagnosisEvidenceTable'

const PacientDetails = () => {
    const { getSelectedPacient, selectedPacient } = usePacientContext()
    const location = useLocation()
    const pacientId = location.pathname.split('/')[3]
    const { _id } = selectedPacient

    React.useEffect(() => {
        if (!_id) {
            getSelectedPacient(pacientId)
        }
    }, [_id])

    return (
        <Page title="Pacijent Detalji">
            <Container maxWidth="lg">
                <Stack sx={{ pb: 5 }} direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Aktivni pacijent</Typography>
                    <Button
                        variant="contained"
                        endIcon={<EventNoteIcon />}
                    >Zakaži Termin</Button>
                </Stack>
                <Card sx={{ overflow: 'hidden' }}>
                    <Grid container>
                        <Grid item xs={12} sm={4} md={3} sx={{}}>
                            <PacientImageBox />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} sx={{}}>
                            <PacientInfoBox />
                        </Grid>
                        <Grid item xs={12} sm={4} md={6} sx={{}}>
                            <PacientNavigation />
                        </Grid>
                    </Grid>
                </Card>
                <Card sx={{ mt: 2, overflow: 'hidden' }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <DiagnosisEvidenceTable />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    )
}

export default PacientDetails
