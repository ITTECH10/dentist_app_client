import React from 'react';
import { useApp } from './AppContext'
import axios from 'axios';

const PacientContext = React.createContext()

export const usePacientContext = () => {
    return React.useContext(PacientContext)
}

const PacientContextProvider = ({ children }) => {
    const { setAppLoading } = useApp()
    const [pacients, setPacients] = React.useState([])
    const [appointments, setAppointments] = React.useState([])

    const getAllPacients = React.useCallback(() => {
        axios('/pacients').then(res => {
            if (res.status === 200) {
                setPacients(res.data.pacients)
                setAppLoading(false)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const value = {
        getAllPacients,
        pacients,
        setPacients,
        appointments,
        setAppointments
    }

    return (
        <PacientContext.Provider value={value}>
            {children}
        </PacientContext.Provider>
    )
}

export default PacientContextProvider