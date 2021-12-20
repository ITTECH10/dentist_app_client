import { useState } from 'react'
import { useEmployeeContext } from './../context/EmployeeContext'
import { actions, hasPermission } from './../utils/DataProviders/ROLES/permissions'

const usePermissions = (action) => {
    const { logedInEmployee } = useEmployeeContext()
    const [allowed, setAllowed] = useState(hasPermission(logedInEmployee, actions[action]))

    return [allowed, setAllowed]
}

export default usePermissions