import * as React from 'react';
import { useApp } from './../../context/AppContext'
import { usePacientContext } from './../../context/PacientContext'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import editFill from '@iconify/icons-eva/edit-fill';
import ListItemIcon from '@mui/material/ListItemIcon'
import Autocomplete from '@mui/material/Autocomplete'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
/////////////////////////////////////////

import { Icon } from '@iconify/react';

const initialFields = {
    pacientId: '',
    date: new Date(),
    note: ''
}

export default function EditAppointmentDialog({ appointmentId }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { pacients, appointments, setAppointments } = usePacientContext()
    const { setGeneralAlertOptions } = useApp()
    const [fields, setFields] = React.useState(initialFields)

    const autoCompleteAppointments = pacients.map(pacient => {
        return {
            id: pacient._id,
            label: `${pacient.firstName} ${pacient.lastName}`
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
        axios(`/appointments/${appointmentId}`)
            .then(res => {
                if (res.status === 200) {
                    setFields({
                        ...res.data.appointment,
                        pacientId: res.data.appointment.pacientId._id
                    })
                }
            }).catch(err => {
                console.log(err)
            })
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

        axios.put(`/appointments/${appointmentId}`, { ...fields }).then(res => {
            if (res.status === 200) {
                const updatedAppointments = [...appointments]
                const updatingAppointmentIndex = updatedAppointments.findIndex(appointment => appointment._id === appointmentId)
                const foundAppointment = updatedAppointments[updatingAppointmentIndex]

                // THIS HAS THE POTENTIAL TO BE DONE BETTER
                const pacientToChangeTo = pacients.find(pacient => pacient._id === fields.pacientId)

                foundAppointment.note = res.data.updatedAppointment.note
                foundAppointment.date = res.data.updatedAppointment.date
                foundAppointment.pacientName = `${pacientToChangeTo.firstName} ${pacientToChangeTo.lastName}`

                setAppointments(updatedAppointments)
                setBtnLoading(false)
                setOpen(false)
                setGeneralAlertOptions({
                    open: true,
                    message: 'Uspješno ste izmjenili informacije o terminu!',
                    severity: 'success',
                    hideAfter: 5000
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
                <ListItemIcon>
                    <Icon icon={editFill} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Izmjeni" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Izmjenite informacije o terminu</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste izmjenili informacije povezane sa ovim terminom,
                        molimo vas ispunite formu ispod.
                    </DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Autocomplete
                                disablePortal
                                id="pacientId"
                                name="pacientId"
                                required
                                options={autoCompleteAppointments}
                                onChange={(e, v) => setFields({ ...fields, pacientId: v.id })}
                                fullWidth
                                renderInput={(params) => <TextField
                                    {...params} variant="standard" sx={{ mt: 1 }} label="Za" />}
                            />
                            <DateTimePicker
                                label="Datum i vrijeme"
                                value={fields.date}
                                required
                                ampm={false}
                                onChange={(value) => setFields({ ...fields, date: value })}
                                renderInput={(params) => <TextField variant="standard" sx={{ mt: 1, mb: -1 }} fullWidth {...params} />}
                            />
                            <TextField
                                margin="dense"
                                id="note"
                                name="note"
                                placeholder={fields.note}
                                label="Kratak nagovještaj..."
                                fullWidth
                                multiline
                                rows={3}
                                variant="standard"
                                onChange={handleChange}
                            />
                            <DialogActions>
                                <Button variant="contained" color="error" onClick={handleClose}>Nazad</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
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
