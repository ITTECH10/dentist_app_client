import * as React from 'react';
import { usePacientContext } from '../../context/PacientContext'
import { useEmployeeContext } from '../../context/EmployeeContext'
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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
/////////////////////////////
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

const initialFields = {
    image: '',
    selectedPacient: '',
    date: new Date(),
    summary: '',
    tooth: '',
    ordination: '',
    kind: ''
}

export default function AddDiagnosisDialog({ title, pacientId, onlyIcon }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const [fields, setFields] = React.useState(initialFields)
    const { pacients, diagnosis, setDiagnosis } = usePacientContext()
    const { logedInEmployee } = useEmployeeContext()
    const { setGeneralAlertOptions } = useApp()
    const disabledSubmitCheck = (Object.values(fields).slice(1, 7).some(field => field === '') && !pacientId) || (Object.values(fields).slice(2, 7).some(field => field === '') && pacientId)

    const formData = new FormData()
    formData.append('photo', fields.image)
    formData.append('pacientId', fields.selectedPacient)
    formData.append('date', fields.date)
    formData.append('summary', fields.summary)
    formData.append('tooth', fields.tooth)
    formData.append('ordination', fields.ordination)
    formData.append('kind', fields.kind)

    let addDiagnosisTimeout
    React.useState(() => {
        return () => {
            clearTimeout(addDiagnosisTimeout)
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

        axios({
            method: 'POST',
            url: `/pacients/${!pacientId ? fields.selectedPacient : pacientId}/diagnosis`,
            headers: { "Content-Type": "application/json" },
            data: formData
        }).then(res => {
            if (res.status === 201) {
                const updatedAppointments = [...diagnosis, { ...res.data.newDiagnosis, pacientName: res.data.pacientName, employeeName: res.data.employeeName }]

                setDiagnosis(updatedAppointments)
                setOpen(false)
                setBtnLoading(false)
                setGeneralAlertOptions({
                    open: true,
                    severity: 'success',
                    message: 'Uspješno ste dodali diagnozu!',
                    hideAfter: 5000
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const handleUploadBoxOpening = () => {
        const input = document.getElementById('upload-diagnosis-photo')
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
                <AssignmentTurnedInIcon onClick={handleClickOpen} />
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
                <DialogTitle>Nova diagnoza</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste dodali novu diagnozu, molimo vas popunite informacije
                        ispod.
                    </DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <input
                                id="upload-diagnosis-photo"
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
                                value={fields.date}
                                required
                                ampm={false}
                                onChange={(value) => setFields({ ...fields, date: value })}
                                renderInput={(params) => <TextField variant="standard" sx={{ mt: 1, mb: -1 }} fullWidth {...params} />}
                            />
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
                                name="kind"
                                id="kind"
                                label="Vrsta diagnoze (npr: sanacija)..."
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="tooth"
                                id="tooth"
                                label="Zub"
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="ordination"
                                id="ordination"
                                label="Ordinacija"
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="summary"
                                id="summary"
                                label="Zaključak..."
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
                    </LocalizationProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}
