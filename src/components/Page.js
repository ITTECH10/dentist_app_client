import { useApp } from './../context/AppContext'
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// material
import { Box } from '@mui/material';
import Alert from './_reusable/Alert'

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', ...other }, ref) => {
  const { authenticated } = useApp()

  return (
    <Box ref={ref} {...other}>
      {authenticated && <Alert />}
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  )
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;
