import * as React from 'react';
import { useApp } from './../../context/AppContext'
import { usePacientContext } from './../../context/PacientContext'
import { useEmployeeContext } from './../../context/EmployeeContext'
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
    image: '',
    pacientId: '',
    date: new Date(),
    summary: '',
    tooth: '',
    ordination: '',
    kind: ''
}

export default function EditDiagnosisDialog({ diagnosisId }) {
    const [open, setOpen] = React.useState(false)
    const [btnLoading, setBtnLoading] = React.useState(false)
    const { diagnosis, pacients, setDiagnosis, selectedPacient, setSelectedPacient } = usePacientContext()
    const { logedInEmployee } = useEmployeeContext()
    const { setGeneralAlertOptions } = useApp()
    const [fields, setFields] = React.useState(initialFields)

    let updateDiagnosisTimeout
    React.useEffect(() => {
        return () => {
            clearTimeout(updateDiagnosisTimeout)
        }
    }, [])

    const autoCompletePacients = pacients.map(pacient => {
        return {
            id: pacient._id,
            label: `${pacient.firstName} ${pacient.lastName}`
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
        axios(`/diagnosis/${diagnosisId}`)
            .then(res => {
                if (res.status === 200) {
                    setFields({
                        ...res.data.diagnosis,
                        pacientId: res.data.diagnosis.pacientId._id
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

        axios.put(`/diagnosis/${diagnosisId}`, { ...fields }).then(res => {
            if (res.status === 200) {
                const updatedDiagnosis = [...diagnosis]
                const updatingDiagnosisIndex = updatedDiagnosis.findIndex(diagnose => diagnose._id === diagnosisId)
                const foundDiagnosis = updatedDiagnosis[updatingDiagnosisIndex]

                // THIS IS A WORKAROUND
                const pacientToChangeTo = pacients.find(pacient => pacient._id === fields.pacientId)
                ///////////////////

                foundDiagnosis.summary = res.data.diagnosis.summary
                foundDiagnosis.tooth = res.data.diagnosis.tooth
                foundDiagnosis.kind = res.data.diagnosis.kind
                foundDiagnosis.ordination = res.data.diagnosis.ordination
                foundDiagnosis.image = res.data.diagnosis.image
                foundDiagnosis.date = res.data.diagnosis.date
                foundDiagnosis.pacientName = `${pacientToChangeTo.firstName} ${pacientToChangeTo.lastName}`
                foundDiagnosis.employeeName = `${logedInEmployee.firstName} ${logedInEmployee.lastName}`
                setDiagnosis(updatedDiagnosis)

                if (selectedPacient.diagnosis) {
                    const selectedPacientDiagnosisCopy = [...selectedPacient.diagnosis]
                    const updatingDiagnosisIndex = selectedPacientDiagnosisCopy.findIndex(diagnose => diagnose._id === diagnosisId)
                    const foundSelectedPacientDiagnosis = selectedPacientDiagnosisCopy[updatingDiagnosisIndex]

                    foundSelectedPacientDiagnosis.summary = res.data.diagnosis.summary
                    foundSelectedPacientDiagnosis.tooth = res.data.diagnosis.tooth
                    foundSelectedPacientDiagnosis.kind = res.data.diagnosis.kind
                    foundSelectedPacientDiagnosis.ordination = res.data.diagnosis.ordination
                    foundSelectedPacientDiagnosis.image = res.data.diagnosis.image
                    foundSelectedPacientDiagnosis.date = res.data.diagnosis.date
                    foundSelectedPacientDiagnosis.pacientName = `${pacientToChangeTo.firstName} ${pacientToChangeTo.lastName}`
                    foundSelectedPacientDiagnosis.employeeName = `${logedInEmployee.firstName} ${logedInEmployee.lastName}`

                    setSelectedPacient(prevState => ({
                        ...prevState,
                        diagnosis: selectedPacientDiagnosisCopy
                    }))
                }
            }
            setBtnLoading(false)
            setOpen(false)
            setGeneralAlertOptions({
                open: true,
                message: 'Uspješno ste izmjenili informacije o dijagnozi!',
                severity: 'success',
                hideAfter: 5000
            })
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
            <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
                <ListItemIcon>
                    <Icon icon={editFill} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Izmjeni" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Izmjenite informacije o dijagnozi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Da biste izmjenili informacije povezane sa ovom dijagnozom,
                        molimo vas ispunite formu ispod.
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
                                ampm={false}
                                onChange={(value) => setFields({ ...fields, date: value })}
                                renderInput={(params) => <TextField variant="standard" sx={{ mt: 1, mb: !diagnosisId ? -1 : 1 }} fullWidth {...params} />}
                            />
                            {!diagnosisId &&
                                <Autocomplete
                                    disablePortal
                                    id="pacients-box-filter"
                                    options={autoCompletePacients}
                                    onChange={(e, v) => setFields({ ...fields, pacientId: v.id })}
                                    fullWidth
                                    renderInput={(params) => <TextField
                                        {...params} variant="standard" sx={{ mt: 1 }} label="Za" />}
                                />}
                            <TextField
                                name="kind"
                                placeholder={fields.kind}
                                id="kind"
                                label="Vrsta diagnoze (npr: sanacija)..."
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                            />
                            <TextField
                                name="tooth"
                                placeholder={fields.tooth}
                                id="tooth"
                                label="Zub"
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                            />
                            <TextField
                                name="ordination"
                                placeholder={fields.ordination}
                                id="ordination"
                                label="Ordinacija"
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                            />
                            <TextField
                                name="summary"
                                placeholder={fields.summary}
                                id="summary"
                                label="Zaključak..."
                                fullWidth
                                onChange={handleChange}
                                variant="standard"
                                multiline
                                rows={3}
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
