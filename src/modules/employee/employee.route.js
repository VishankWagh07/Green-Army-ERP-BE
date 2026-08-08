import express from "express";

import { validate } from "../../middlewares/validate.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { dailyLogQuerySchema, dailyLogSchema, idParamSchema, typeParamSchema, updateAttendanceSchema, userIdParamSchema } from "./employee.schema.js";
import { addDailyLogController, attendanceController, checkInOutController, dailyLogsController, updateAttendanceController } from "./employee.controller.js";
import { PRIVILEGED_ROLES } from "../../constants/common.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router.use(authenticate);

// ATTENDANCE

router.get(
    '/attendance/list/:userId',
    validate({ params: userIdParamSchema }),
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

router.get('/daily-logs', authorize(PRIVILEGED_ROLES), validate({ params: dailyLogQuerySchema }), asyncHandler(dailyLogsController));

router.post('/daily-logs', validate({ body: dailyLogSchema }), asyncHandler(addDailyLogController));

router.get(
    '/:userId/latest',
    authorize(PRIVILEGED_ROLES),
    validate({ params: userIdParamSchema }),
    asyncHandler(latestLogController)
);

router.get(
    '/:userId/history',
    authorize(PRIVILEGED_ROLES),
    validate({ params: userIdParamSchema, query: historyQuerySchema }),
    asyncHandler(logHistoryController)
);

export default router;