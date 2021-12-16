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
                    navigate(`/dashboard/pacients/${id}`)
                }
            }).catch(err => console.log(err))
    }, [selectedPacient])

    const value = {
        getAllPacients,
        pacients,
        setPacients,
        appointments,
        setAppointments,
        getSelectedPacient,
        selectedPacient
    }

    return (
        <PacientContext.Provider value={value}>
            {children}
        </PacientContext.Provider>
    )
}

export default PacientContextProvider