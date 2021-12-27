import React from 'react';
import { useApp } from './AppContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PacientContext = React.createContext()

export const usePacientContext = () => {
    return React.useContext(PacientContext)
}

const PacientContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const { setAppLoading } = useApp()

    const [pacients, setPacients] = React.useState([])
    const [selectedPacient, setSelectedPacient] = React.useState({})
    const [appointments, setAppointments] = React.useState([])
    const [diagnosis, setDiagnosis] = React.useState([])

    // UPCOMING APPOINTMENTS 
    const [upcomingAppointments, setUpcomingAppointments] = React.useState()

    const getAllPacients = React.useCallback(() => {
        axios('/pacients').then(res => {
            if (res.status === 200) {
                setPacients(res.data.pacients)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const getSelectedPacient = React.useCallback((id) => {
        setAppLoading(true)
        axios(`/pacients/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setAppLoading(false)
                    setSelectedPacient(res.data.pacient)
                    navigate(`/pacients/${id}`)
                }
            }).catch(err => console.log(err.response))
    }, [selectedPacient])

    const getAllAppointments = React.useCallback(() => {
        axios('/appointments').then(res => {
            if (res.status === 200) {
                setAppointments(res.data.appointments)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const getUpcomingAppointments = React.useCallback(() => {
        axios('/appointments/upcoming')
            .then(res => {
                if (res.status === 200) {
                    setUpcomingAppointments(res.data.results)
                }
            }).catch(err => console.log(err))
    }, [])

    const getAllDiagnosis = React.useCallback(() => {
        axios('/diagnosis').then(res => {
            if (res.status === 200) {
                setDiagnosis(res.data.diagnosis)
            }
        }).catch(err => console.log(err))
    }, [])


    const value = {
        getAllPacients,
        pacients,
        setPacients,
        appointments,
        setAppointments,
        getAllAppointments,
        getSelectedPacient,
        selectedPacient,
        setSelectedPacient,
        diagnosis,
        setDiagnosis,
        getAllDiagnosis,
        upcomingAppointments,
        getUpcomingAppointments
    }

    return (
        <PacientContext.Provider value={value}>
            {children}
        </PacientContext.Provider>
    )
}

export default PacientContextProvider