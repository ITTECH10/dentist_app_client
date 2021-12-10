import React from 'react';

const AppContext = React.createContext()

export const useApp = () => {
    return React.useContext(AppContext)
}

const AppContextProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = React.useState(false)
    const [appLoading, setAppLoading] = React.useState(false)

    const value = {
        authenticated,
        setAuthenticated,
        setAppLoading,
        appLoading
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider