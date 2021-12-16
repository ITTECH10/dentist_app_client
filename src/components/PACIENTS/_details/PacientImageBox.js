import React from 'react'
import { usePacientContext } from '../../../context/PacientContext'
import { Stack, Box, Typography } from '@mui/material'
// import PacientImage from '/static/mock-images/avatars/avatar_9.jpg'

const PacientBasicsBox = () => {
    const { selectedPacient } = usePacientContext()
    const { pacientImage, firstName, lastName, birthDate } = selectedPacient
    const formatedBirthDate = new Date(birthDate).toLocaleDateString()

    return (
        <Stack direction="row">
            <Box sx={{ height: 250, width: '100%' }}>
                <img style={{ height: '100%', width: '100%' }} src={pacientImage} alt="pacient-photo" />
            </Box>
        </Stack>
    )
}

export default PacientBasicsBox
