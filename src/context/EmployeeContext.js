import React from 'react';

const EmployeeContext = React.createContext()

export const useEmployeeContext = () => {
    return React.useContext(EmployeeContext)
}

const EmployeeContextProvider = ({ children }) => {
    const value = {

    }

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider