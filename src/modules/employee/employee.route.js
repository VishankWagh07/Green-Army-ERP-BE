import express from "express";

import { validate } from "../../middlewares/validate.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { attendanceQuerySchema, dailyLogSchema, historyQuerySchema, idParamSchema, typeParamSchema, updateAttendanceSchema, userIdParamSchema } from "./employee.schema.js";
import { addDailyLogController, attendanceController, checkInOutController, logHistoryController, updateAttendanceController } from "./employee.controller.js";
import { PRIVILEGED_ROLES } from "../../constants/common.js";
import { authenticate, authorize } from "../../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// ATTENDANCE

router.get(
    '/attendance/list/:userId',
    validate({ params: userIdParamSchema, query:attendanceQuerySchema }),
    asyncHandler(attendanceController)
);

router.post('/attendance/check-in-out/:type', validate({ params: typeParamSchema }), asyncHandler(checkInOutController));

router.patch(
    '/attendance/:attendanceId',
    authorize(PRIVILEGED_ROLES),
    validate({ params: idParamSchema, body: updateAttendanceSchema }),
    asyncHandler(updateAttendanceController)
);


// DAILY LOGS

router.post('/daily-logs', validate({ body: dailyLogSchema }), asyncHandler(addDailyLogController));

router.get(
    '/daily-logs/history/:userId',
    authorize(PRIVILEGED_ROLES),
    validate({ params: userIdParamSchema, query: historyQuerySchema }),
    asyncHandler(logHistoryController)
);

export default router;