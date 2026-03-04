import { combineReducers } from "redux";
import { errorReducer } from "./errorReducer";
import successReducer from "./successReducer";
import rolesPermissionsReducer from "./rolesPermissionsReducer";
import auditLogsReducer from "./auditLogsReducer";
import tablesReducer from "./tablesReducer";
import itemsReducer from "./itemsReducer";
import categoriesReducer from "./categoriesReducer";
import menusReducer from "./menusReducer";
import ordersReducer from "./ordersReducer";
import transactionsReducer from "./transactionsReducer";
import cartReducer from "./cartReducer";
import usersReducer from "./usersReducer";
import notificationReducer from "./notificationReducer";
import settingsReducer from "./settingsReducer";

const rootReducer = combineReducers({
    success: successReducer,
    errors: errorReducer,
    notification: notificationReducer,
    roles: rolesPermissionsReducer,
    auditLogs: auditLogsReducer,
    tables: tablesReducer,
    items: itemsReducer,
    categories: categoriesReducer,
    menus: menusReducer,
    orders: ordersReducer,
    transactions: transactionsReducer,
    cart: cartReducer,
    users: usersReducer,
    settings: settingsReducer
});

export default rootReducer;