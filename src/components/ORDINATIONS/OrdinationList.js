import React from 'react'
import { useEmployeeContext } from './../../context/EmployeeContext'
import { Grid } from '@mui/material'
import OrdinationCard from './OrdinationCard'

const OrdinationList = ({ ...other }) => {
    const { ordinations } = useEmployeeContext()

    return (
        <Grid container spacing={3} {...other}>
            {ordinations.map((ordination) => (
                <Grid key={ordination._id} item xs={12} sm={6} md={3}>
                    <OrdinationCard ordination={ordination} />
                </Grid>
            ))}
        </Grid>
    )
}

export default OrdinationList
