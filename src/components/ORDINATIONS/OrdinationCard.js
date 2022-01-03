import PropTypes from 'prop-types';
// material
import { Box, Card, Typography, Stack, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// ----------------------------------------------------------------------

const OrdinationImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------

OrdinationCard.propTypes = {
    ordination: PropTypes.object
};

export default function OrdinationCard({ ordination }) {
    const { name, founded, location, image } = ordination;

    return (
        <Card>
            <Box sx={{ pt: '80%', position: 'relative' }}>
                <OrdinationImgStyle alt={name} src={image} />
            </Box>

            <Stack spacing={2} sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" noWrap>
                        {name}
                    </Typography>
                    <Box>
                        <Tooltip title="Uredi">
                            <Button sx={{ minWidth: 0, pl: .5, py: 0 }} startIcon={<EditIcon />} />
                        </Tooltip>
                        <Tooltip title="Obriši">
                            <Button sx={{ minWidth: 0, pl: .5, py: 0 }} startIcon={<DeleteIcon style={{ color: 'red', marginRight: 0 }} />} />
                        </Tooltip>
                    </Box>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1">
                        <Typography
                            component="span"
                            variant="subtitle1"
                        >
                            Lokacija:
                        </Typography>
                        &nbsp;
                        {location}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1">
                        <Typography
                            component="span"
                            variant="subtitle1"
                        >
                            Datum osnivanja:
                        </Typography>
                        &nbsp;
                        {new Date(founded).toLocaleDateString('bs-BA')}
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
