import React from 'react';
import axios from 'axios';

const PacientContext = React.createContext()

export const usePacientContext = () => {
    return React.useContext(PacientContext)
}

const PacientContextProvider = ({ children }) => {
    const [pacients, setPacients] = React.useState([])
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