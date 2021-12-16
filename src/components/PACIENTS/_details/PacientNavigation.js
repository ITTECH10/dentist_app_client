import React from 'react'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HistoryIcon from '@mui/icons-material/History';

const PacientNavigation = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Stack direction="row" sx={{ height: '100%' }} alignItems="flex-end" justifyContent="flex-end">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon position tabs example"
            >
                <Tab icon={<HistoryIcon />} iconposition="start" label="Evidencija" />
            </Tabs>
        </Stack>
    )
}

export default PacientNavigation
