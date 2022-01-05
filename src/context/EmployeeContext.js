import React from 'react';
import axios from 'axios';
import { useApp } from './AppContext'
import { IS_SUPER_ADMIN, actions } from './../utils/DataProviders/ROLES/permissions'

const EmployeeContext = React.createContext()

export const useEmployeeContext = () => {
    return React.useContext(EmployeeContext)
}

const EmployeeContextProvider = ({ children }) => {
    const { setAppLoading } = useApp()
    ///////////////////////////

    const [employees, setEmployees] = React.useState([])
    const [logedInEmployee, setLogedInEmployee] = React.useState({})
    const [isSuperAdmin, setIsSuperAdmin] = React.useState(false)
    const [ordinations, setOrdinations] = React.useState()

    const getAllOrdinations = React.useCallback(() => {
        axios('/ordinations')
            .then(res => {
                if (res.status === 200) {
                    setOrdinations(res.data.ordinations)
                }
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const getAllEmployees = React.useCallback(() => {
        axios('/employees')
            .then(res => {
                if (res.status === 200) {
                    setEmployees(res.data.employees)
                }
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const getLogedInEmployee = React.useCallback(() => {
        setAppLoading(true)
        axios('/employees/me')
            .then(res => {
                if (res.status === 200) {
                    setAppLoading(false)
                    setLogedInEmployee(res.data.employee)
                    setIsSuperAdmin(IS_SUPER_ADMIN(res.data.employee, actions.IS_SUPER_ADMIN))
                }
            }).catch(err => console.log(err))
    }, [setAppLoading])

    const value = {
        employees,
        setEmployees,
        getAllEmployees,
        logedInEmployee,
        setLogedInEmployee,
        getLogedInEmployee,
        isSuperAdmin,
        getAllOrdinations,
        ordinations,
        setOrdinations
    }

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider