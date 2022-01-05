import React, { useState } from 'react'
//////////////////////////////
import { Container, Grid, Typography, Box } from '@mui/material'
//////////////////////////////
import Page from '../components/Page'
import LeftSidebar from '../components/_settings/LeftSidebar'
import RightSidebar from '../components/_settings/RightSidebar'
import { items as settingItems } from '../_mocks_/settings'

const SettingsPage = () => {
    const [itemActive, setItemActive] = useState(0)

    return (
        <Page title="Postavke">
            <Container>
                <Box mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Postavke
                    </Typography>
                </Box>
                <Grid container spacing={3}>
                    <LeftSidebar
                        items={settingItems}
                        itemActive={itemActive}
                        setItemActive={setItemActive}
                    />
                    <RightSidebar
                        itemActive={itemActive}
                    />
                </Grid>
            </Container>
        </Page>
    )
}

export default SettingsPage
