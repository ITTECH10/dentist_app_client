import React from 'react';
import axios from 'axios';
import { useApp } from './AppContext'
import { IS_SUPER_ADMIN, actions } from './../utils/DataProviders/ROLES/permissions'

const EmployeeContext = React.createContext()

export const useEmployeeContext = () => {
    return React.useContext(EmployeeContext)
}

const EmployeeContextProvider = ({ children }) => {
    // CONSIDER LATER LOGIC
    const { setAuthenticated, setAppLoading } = useApp()
    ///////////////////////////

    const [employees, setEmployees] = React.useState([])
    const [logedInEmployee, setLogedInEmployee] = React.useState({})
    const [isSuperAdmin, setIsSuperAdmin] = React.useState(false)

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
    }, [])

    const value = {
        employees,
        setEmployees,
        logedInEmployee,
        getLogedInEmployee,
        isSuperAdmin
    }

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider