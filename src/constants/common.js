import { USER_ROLES } from "./auth.js";

export const STOCK_TYPES = {
    SAPLING:"SAPLING",
    GUARD:"GUARD",
}

export const PHOTO_ENTITY_TYPES = {
    PLANTATION: 'PLANTATION',
    EMPLOYEE_DAILY_LOG: 'EMPLOYEE_DAILY_LOG',
    DONATION_STICKER: 'DONATION_STICKER'
}

export const STOCK_LOG_REFS = {
    PLANTATION: 'PLANTATION',
    DONATION: 'DONATION',
    DAMAGE: 'DAMAGE'
}

export const ATTENDANCE_STATUS = {
    Present: 'Present',
    Absent: 'Absent',
    "Half Day": 'Half Day',
    Leave: 'Leave',
    Holiday: 'Holiday',
    "Weekly Off": 'Weekly Off',
}

export const PRIVILEGED_ROLES = [USER_ROLES.ADMIN, USER_ROLES.TEAM_MANAGER];

export const PLANTATION_STATUS = {
    Pending: "Pending",
    Completed: "Completed"
}

export const REPORT_WISE = {
    TEAM_WISE: "TEAM_WISE",
    DONOR_WISE: "DONOR_WISE",
    AREA_WISE: "AREA_WISE",
}

export const RADIUS_ENTITIES = {
    ALL: "ALL",
    PLANTATION: "PLANTATION",
    WATERING: "WATERING",
}

export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;