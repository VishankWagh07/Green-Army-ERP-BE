import { PRIVILEGED_ROLES } from "../../constants/common.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { addDailyLog, attendanceList, checkIn, checkOut, logHistory, updateAttendance } from "./employee.service.js";

// ATTENDANCE

// attendance controller
export const attendanceController = async (req, res) => {
    const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);
    const employeeId = isPrivileged ? req.query.employeeId : req.user.userId;
    const { page, limit } = req.query;

    const { data, total } = await attendanceList({ ...req.query, employeeId });
    sendSuccess(res, { data, meta: { page, limit, total } });
}

// check in out controller
export const checkInOutController = async (req, res) => {
    const { type } = req.params;
    let record = {};

    if (type === "IN") record = await checkIn(req.user.userId);
    if (type === "OUT") record = await checkOut(req.user.userId);

    sendSuccess(res, { data: record });
}

// update attendance controller
export const updateAttendanceController = async (req, res) => {
    const record = await updateAttendance(req.params.attendanceId, req.body);

    sendSuccess(res, { data: record });
}


// DAILY LOGS

// get daily logs controller
// export const dailyLogsController = async (req, res) => {
//     const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);
//     const userId = isPrivileged ? req.query.userId : req.user.userId;
//     const { page, limit } = req.query;

//     const { data, total } = await dailyLogsList(userId, req.query);
//     sendSuccess(res, { data, meta: { page, limit, total } });
// }

// get daily logs controller
export const addDailyLogController = async (req, res) => {
    const log = await addDailyLog(req.user.userId, req.body);
    sendSuccess(res, { data:log });
}

// get log history controller
export const logHistoryController = async (req, res) => {
    const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);
    const userId = isPrivileged ? req.params.userId : req.user.userId;

    const logs = await logHistory(userId, req.query.date);
    sendSuccess(res, { data:logs });
}
