import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Nije pronađeno
      </Typography>
      <Typography variant="body2" align="center">
        Nema rezultata za &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Molimo vas provjerite da li ste pogriješili kao i to da li koristite cjelovite riječi.
      </Typography>
    </Paper>
  );
}
