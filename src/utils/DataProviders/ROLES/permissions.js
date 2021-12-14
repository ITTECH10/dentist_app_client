import { actions, roles } from "./constants.js";

const mappings = new Map();
// GENERAL FOR CONDITIONAL RENDERING // STORED IN GLOBAL STATE // SINGLE SOURCE OF TRUTH // USEFUL
mappings.set(actions.IS_SUPER_ADMIN, [roles.DIRECTOR])

mappings.set(actions.ADD_EMPLOYEE, [roles.DIRECTOR]);

export const hasPermission = (employee, action) => {
    if (!employee?.role) {
        return false;
    }

    if (mappings.has(action)) {
        return mappings.get(action).includes(employee.role);
    }

    return false;
}

export const IS_SUPER_ADMIN = (employee, action) => {
    return hasPermission(employee, action)
}

export { actions, roles };
