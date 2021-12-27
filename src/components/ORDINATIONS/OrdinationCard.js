import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Button, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { mockImgCover } from '../../utils/mockImages';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// const cover = mockImgCover(12)
// const cover = 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'

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
