import React from 'react'
import { usePacientContext } from '../../../context/PacientContext'
import { Stack, Box } from '@mui/material'
import { manipulateCloudinaryImage } from './../../../utils/manipulateCloudinaryImage'

const PacientBasicsBox = () => {
    const { selectedPacient } = usePacientContext()
    const { pacientImage } = selectedPacient
    const manipulatedImage = manipulateCloudinaryImage(pacientImage)

    return (
        <Stack direction="row">
            <Box sx={{ height: 250, width: '100%' }}>
                <img style={{ height: '100%', width: '100%' }} src={manipulatedImage} alt="pacient" />
            </Box>
        </Stack>
    )
}

export default PacientBasicsBox
