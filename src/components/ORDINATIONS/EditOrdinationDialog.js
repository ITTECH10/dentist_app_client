import React from 'react'
import { useApp } from '../../context/AppContext'
import { useEmployeeContext } from '../../context/EmployeeContext'
import axios from 'axios'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
//////////////////////////////////////////////////
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';

const initialFields = {
    name: '',
    location: '',
    founded: new Date(),
    image: ''
}

const EditOrdinationDialog = ({ ordinationId }) => {
    const { ordinations, setOrdinations } = useEmployeeContext()
    const { setGeneralAlertOptions } = useApp()

    const [open, setOpen] = React.useState(false)
    const [fields, setFields] = React.useState(initialFields)
    const [btnLoading, setBtnLoading] = React.useState(false)

    const formData = new FormData()
    formData.append('name', fields.name)
    formData.append('location', fields.location)
    formData.append('founded', fields.founded)
    formData.append('photo', fields.image)

    const handleClickOpen = () => {
        setOpen(true);
        axios(`/ordinations/${ordinationId}`)
            .then(res => {
                if (res.status === 200) {
                    setFields({
                        ...res.data.ordination
                    })
                }
            }).catch(err => {
                console.log(err)
            })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = e => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setBtnLoading(true)

        axios({
            method: 'PUT',
            data: formData,
            url: `/ordinations/${ordinationId}`,
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                if (res.status === 200) {
                    const updatedOrdinations = [...ordinations]
                    const updatingOrdinationIndex = updatedOrdinations.findIndex(ordination => ordination._id === ordinationId)
                    const foundOrdination = updatedOrdinations[updatingOrdinationIndex]

                    foundOrdination.name = res.data.updatingOrdination.name
                    foundOrdination.location = res.data.updatingOrdination.location
                    foundOrdination.founded = res.data.updatingOrdination.founded
                    foundOrdination.image = res.data.updatingOrdination.image

                    setOrdinations(updatedOrdinations)
                    setBtnLoading(false)
                    setOpen(false)
                    setGeneralAlertOptions({
                        open: true,
                        message: 'Uspješno ste izmjenili informacije o ordinaciji!',
                        severity: 'success',
                        hideAfter: 5000
                    })
                }
            })
    }

    const handleUploadBoxOpening = () => {
        const input = document.getElementById('upload-ordination-photo-edit')
        input.click()
    }

    const handleImageSelection = (e) => {
        const photo = e.target.files[0]
        setFields({
            ...fields,
            image: photo
        })
    }

    return (
        <>
            <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
                <ListItemIcon>
                    <Icon icon={editFill} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Izmjeni" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nova Ordinacija</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novu ordinaciju, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <input
                                id="upload-ordination-photo-edit"
                                name="image"
                                type="file"
                                onChange={handleImageSelection}
                                hidden
                            />
                            <Button
                                variant="contained"
                                sx={{ mt: 1 }}
                                onClick={handleUploadBoxOpening}
                            >
                                {fields.image !== '' ? 'Promjeni sliku' : 'Dodaj sliku'}
                            </Button>
                            <DateTimePicker
                                label="Datum i vrijeme"
                                value={fields.founded}
                                required
                                ampm={false}
                                onChange={(value) => setFields({ ...fields, founded: value })}
                                renderInput={(params) => <TextField variant="standard" sx={{ mt: 1, mb: -1 }} fullWidth {...params} />}
                            />
                            <TextField
                                name="name"
                                autoFocus
                                placeholder={fields.name}
                                margin="dense"
                                id="name"
                                onChange={handleChange}
                                label="Naziv"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                name="location"
                                placeholder={fields.location}
                                margin="dense"
                                id="name"
                                onChange={handleChange}
                                label="Mjesto"
                                fullWidth
                                variant="standard"
                            />
                            <DialogActions>
                                <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={Object.values(fields).some(field => field === '')}
                                >
                                    {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                                </Button>
                            </DialogActions>
                        </Box>
                    </LocalizationProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default EditOrdinationDialog
