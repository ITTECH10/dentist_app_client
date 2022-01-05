import React from 'react'
////////////////////////////
import { useTheme } from '@mui/material/styles'
import { Grid, Paper, Typography } from '@mui/material'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
///////////////////////////

const activeMenuItem = {
    backgroundColor: 'rgba(145, 158, 171, 0.08)'
}

const menuItemRoot = {
    mb: 1
}

const LeftSidebar = ({ items, itemActive, setItemActive }) => {
    const theme = useTheme()

    const activeListItemText = {
        borderRight: `3px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main
    }

    const itemSelectionHandler = (index) => {
        setItemActive(index)
    }

    const settingsMenuItem = items.map((item, i) => (
        <MenuItem
            key={i}
            sx={itemActive === i && { ...activeMenuItem }, { ...menuItemRoot }}
            onClick={() => itemSelectionHandler(i)}
        >
            <ListItemIcon>
                {item.icon}
            </ListItemIcon>
            <ListItemText
                sx={itemActive === i ? { ...activeListItemText } : {}}
            >
                {item.name}
            </ListItemText>
        </MenuItem >
    ))

    return (
        <Grid item xs={12} sm={5} md={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                    Generalno
                </Typography>
                <MenuList>
                    {settingsMenuItem}
                </MenuList>
            </Paper>
        </Grid>
    )
}

export default LeftSidebar
