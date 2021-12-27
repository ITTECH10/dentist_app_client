import React from 'react';
import axios from 'axios'
import { useEmployeeContext } from './../context/EmployeeContext'

// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';

import ActionButton from '../components/_reusable/ActionButton';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { actions, nonAdminActions } from '../utils/DataProviders/ActionButton'
import { actions as permissionActions, hasPermission } from './../utils/DataProviders/ROLES/permissions'
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { isSuperAdmin, logedInEmployee } = useEmployeeContext()
  const dashboardBoxVisible = hasPermission(logedInEmployee, permissionActions.MAIN_ROLE_UI_VISIBILITY)

  return (
    <Page title="Radna Površina">
      <Container maxWidth="xl">
        <ActionButton
          actions={isSuperAdmin ? actions : nonAdminActions}
          actionIcon={<SpeedDialIcon />}
        />
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Pozdrav, dobrodošli nazad!</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          {dashboardBoxVisible &&
            <Grid item xs={12} sm={6} md={3}>
              <AppNewUsers />
            </Grid>}
          {dashboardBoxVisible &&
            <Grid item xs={12} sm={6} md={3}>
              <AppItemOrders />
            </Grid>}
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
