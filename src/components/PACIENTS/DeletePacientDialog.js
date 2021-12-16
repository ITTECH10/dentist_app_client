import * as React from 'react';
import { useApp } from './../../context/AppContext'
import { usePacientContext } from './../../context/PacientContext'
import axios from 'axios'

/////////////////////////
// material
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
////////////////////////
//other
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import editFill from '@iconify/icons-eva/edit-fill';

export default function DeletePacientDialog({ pacientId }) {
    const [open, setOpen] = React.useState(false);
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { setGeneralAlertOptions } = useApp()
    const { pacients, setPacients } = usePacientContext()

    let deletePacientTimeout
    React.useEffect(() => {
        return () => {
            clearTimeout(deletePacientTimeout)
        }
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnLoading(true)

        axios.delete(`/pacients/${pacientId}`)
            .then(res => {
                if (res.status === 204) {
                    const updatedPacients = pacients.filter(pacient => pacient._id !== pacientId)

                    deletePacientTimeout = setTimeout(() => {
                        setBtnLoading(false)
                        setPacients(updatedPacients)
                        setOpen(false)
                        setGeneralAlertOptions({
                            open: true,
                            message: 'Uspješno ste obrisali pacijenta!',
                            severity: 'success',
                            hideAfter: 5000
                        })
                    }, 1000)
                }
            })
    }

    return (
        <div>
            <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
                <ListItemIcon>
                    <Icon icon={trash2Outline} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Obriši" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Da li ste sigurni da želite obrisati ovog pacijenta?"}
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <DialogContentText id="alert-dialog-description">
                            Upozorenje! Nakon brisanja ovog pacijenta nema povratka nazad!
                            Da li ste sigurni da želite obrisati ovog pacijenta?
                        </DialogContentText>
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                            <Button variant="contained" color="success" type="submit" autoFocus>
                                {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>

            </Dialog>
        </div>
    );
}
