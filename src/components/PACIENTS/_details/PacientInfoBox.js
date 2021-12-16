import React from 'react'
import { usePacientContext } from '../../../context/PacientContext'
import { Box, Stack, Typography } from '@mui/material'

const PacientInfoBox = () => {
    const { selectedPacient } = usePacientContext()
    const { firstName, lastName, birthDate, address, phone } = selectedPacient
    const formatedBirthDate = new Date(birthDate).toLocaleDateString()

    return (
        <Box sx={{ p: 1 }}>
            <Stack direction="row" alignItems="center" >
                <Typography variant="body1" sx={{ mr: 1 }}>Ime:</Typography>
                <Typography variant="subtitle1">{firstName}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" >
                <Typography variant="body1" sx={{ mr: 1 }}>Prezime:</Typography>
                <Typography variant="subtitle1">{lastName}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" >
                <Typography variant="body1" sx={{ mr: 1 }}>Datum rođenja:</Typography>
                <Typography variant="subtitle1">{formatedBirthDate}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" >
                <Typography variant="body1" sx={{ mr: 1 }}>Adresa:</Typography>
                <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>{address}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" >
                <Typography variant="body1" sx={{ mr: 1 }}>Telefon:</Typography>
                <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>{phone}</Typography>
            </Stack>
        </Box>
    )
}

export default PacientInfoBox
