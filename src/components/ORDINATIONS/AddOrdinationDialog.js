import * as React from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext'
import { useEmployeeContext } from '../../context/EmployeeContext'

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
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
//////////////////////////////////////////////////

import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

const initialFields = {
    name: '',
    location: '',
    founded: new Date(),
    image: ''
}

export default function AddOrdinationDialog({ onlyIcon, title }) {
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
            method: 'POST',
            data: formData,
            url: '/ordinations',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                if (res.status === 201) {
                    const updatedOrdinations = [...ordinations, res.data.newOrdination]

                    setBtnLoading(false)
                    setOpen(false)
                    setOrdinations(updatedOrdinations)
                    setGeneralAlertOptions({
                        open: true,
                        severity: 'success',
                        message: 'Uspješno ste dodali ordinaciju!',
                        hideAfter: 5000
                    })
                }
            })
    }

    const handleUploadBoxOpening = () => {
        const input = document.getElementById('upload-ordination-photo')
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
            {onlyIcon ?
                <AddBusinessIcon onClick={handleClickOpen} />
                :
                <Button
                    variant="contained"
                    startIcon={<Icon icon={plusFill} />}
                    onClick={handleClickOpen}
                >
                    {title}
                </Button>
            }
            <Dialog open={open} onClose={handleClose}>
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
                                id="upload-ordination-photo"
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
                                margin="dense"
                                id="name"
                                onChange={handleChange}
                                label="Naziv"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                name="location"
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
