import * as React from 'react';
import { usePacientContext } from '../../context/PacientContext'
import { useApp } from '../../context/AppContext'
import axios from 'axios';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const initialFields = {
    date: '',
    note: '',
    selectedPacient: ''
}

export default function AddAppointmentModal({ title, pacientId }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const [fields, setFields] = React.useState(initialFields)
    const { pacients, appointments, setAppointments } = usePacientContext()
    const { setGeneralAlertOptions } = useApp()
    const disabledSubmitCheck = (Object.values(fields).some(field => field === '') && !pacientId) || (Object.values(fields).slice(0, 2).some(field => field === '') && pacientId)

    let addAppointmentTimeout
    React.useState(() => {
        return () => {
            clearTimeout(addAppointmentTimeout)
        }
    }, [])

    const autocompletePacients = pacients.map(pacient => {
        return {
            id: pacient._id,
            label: `${pacient.firstName} ${pacient.lastName}`
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFields(initialFields)
    };

    const handleChange = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnLoading(true)

        axios.post(`/pacients/${!pacientId ? fields.selectedPacient : pacientId}/appointments`, { ...fields })
            .then(res => {
                if (res.status === 201) {
                    const updatedAppointments = [...appointments, { ...res.data.newAppointment }]

                    addAppointmentTimeout = setTimeout(() => {
                        setAppointments(updatedAppointments)
                        setOpen(false)
                        setBtnLoading(false)
                        setGeneralAlertOptions({
                            open: true,
                            severity: 'success',
                            message: 'Uspješno ste dodali termin!',
                            hideAfter: 5000
                        })
                    }, 1000)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            {!title ? <EventNoteIcon onClick={handleClickOpen} /> :
                <Button variant="contained" onClick={handleClickOpen} endIcon={<EventNoteIcon />}>
                    {title}
                </Button>}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novi termin, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        {!pacientId &&
                            <Autocomplete
                                disablePortal
                                id="pacients-box-filter"
                                required
                                options={autocompletePacients}
                                onChange={(e, v) => setFields({ ...fields, selectedPacient: v.id })}
                                fullWidth
                                renderInput={(params) => <TextField
                                    {...params} variant="standard" sx={{ mt: 1 }} label="Za" />}
                            />}
                        <TextField
                            id="date"
                            name="date"
                            required
                            label="Datum"
                            type="date"
                            sx={{ mt: 2 }}
                            fullWidth
                            onChange={handleChange}
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            name="note"
                            id="note"
                            label="Kratak nagovještaj..."
                            fullWidth
                            onChange={handleChange}
                            variant="standard"
                            required
                            multiline
                            rows={3}
                        />
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={disabledSubmitCheck}
                                type="submit"
                            >
                                {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={24} /> : 'Gotovo'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
