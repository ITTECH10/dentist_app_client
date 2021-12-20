import { actions, roles } from "./constants.js";

const mappings = new Map();
mappings.set(actions.IS_SUPER_ADMIN, [roles.DIRECTOR])
mappings.set(actions.MAIN_ROLE_UI_VISIBILITY, [roles.DIRECTOR, roles.DEPUTY]);

mappings.set(actions.ADD_EMPLOYEE, [roles.DIRECTOR]);
mappings.set(actions.EDIT_EMPLOYEE, [roles.DIRECTOR]);
mappings.set(actions.DELETE_EMPLOYEE, [roles.DIRECTOR]);

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
