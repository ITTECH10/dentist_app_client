import React from 'react'
///////////////////////////////////
import { Grid } from '@mui/material'
//////////////////////////////////
import EditMyProfileForm from './EditMyProfileForm'
import ChangePassword from './ChangePassword'

const RightSidebar = ({ itemActive }) => {
    const content = itemActive === 0 ? <EditMyProfileForm />
        : itemActive === 1 ? <ChangePassword /> : null

    return (
        <Grid item xs={12} sm={7} md={8}>
            {content}
        </Grid>
    )
}

export default RightSidebar
