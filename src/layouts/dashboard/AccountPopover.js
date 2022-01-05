import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { useEmployeeContext } from './../../context/EmployeeContext'
import { useApp } from './../../context/AppContext'
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
//
import account from '../../_mocks_/account';
import { manipulateCloudinaryImage } from './../../utils/manipulateCloudinaryImage'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Početna',
    icon: homeFill,
    linkTo: '/'
  },
  {
    label: 'Račun',
    icon: personFill,
    linkTo: '#'
  },
  {
    label: 'Postavke',
    icon: settings2Fill,
    linkTo: '/settings'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { logedInEmployee } = useEmployeeContext()
  const { logout } = useApp()
  const { gender, firstName, lastName, email, employeeImage } = logedInEmployee

  const defaultAvatar = gender === 'male' ? account.maleDentistAvatar : account.femaleDentistAvatar
  const manipulatedEmployeeImage = manipulateCloudinaryImage(employeeImage)

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={employeeImage ? manipulatedEmployeeImage : defaultAvatar} alt="dentist" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {`${firstName} ${lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }} onClick={logout}>
          <Button fullWidth color="inherit" variant="outlined">
            Odjava
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
