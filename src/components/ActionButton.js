import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

export default function ActionButton({ y = 30, x = 30, actionIcon, actions }) {
    return (
        <Box
            sx={{ transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: y, right: x, zIndex: 1250 }}
        >
            <SpeedDial
                ariaLabel="SpeedDial"
                icon={actionIcon}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
