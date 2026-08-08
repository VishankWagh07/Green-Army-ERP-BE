import { Op } from 'sequelize';
import { Attendance, EmployeeDailyLog } from '../../models/employee.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { nowTimeOnly, todayDateOnly } from '../../utils/timeHelper.js';
import { User } from '../../models/auth.model.js';

// ATTENDANCE

export async function attendanceList({ page, limit, employeeId, from, to }) {
    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (from || to) {
        where.attendanceDate = {};
        if (from) where.attendanceDate[Op.gte] = from;
        if (to) where.attendanceDate[Op.lte] = to;
    }

    const { rows, count } = await Attendance.findAndCountAll({
        where,
        order: [['attendanceDate', 'DESC']],
        limit,
        offset: (page - 1) * limit,
    });

    return { data: rows, total: count };
}

export async function checkIn(userId) {
    const attendanceDate = todayDateOnly();

    const [record, created] = await Attendance.findOrCreate({
        where: { userId, attendanceDate },
        defaults: { status: 'Present', checkInTime: nowTimeOnly() },
    });

    if (!created) {
        if (record.checkInTime) throw ApiError.conflict('Already checked in today');
        await record.update({ status: 'Present', checkInTime: nowTimeOnly() });
    }

    return record;
}

export async function checkOut(userId) {
    const attendanceDate = todayDateOnly();
    const record = await Attendance.findOne({ where: { userId, attendanceDate } });

    if (!record) throw ApiError.notFound('No check-in found for today - check in first');
    if (record.checkOutTime) throw ApiError.conflict('Already checked out today');

    await record.update({ checkOutTime: nowTimeOnly() });
    return record;
}

export async function updateAttendance(attendanceId, payload) {
    const record = await Attendance.findByPk(attendanceId);
    if (!record) throw ApiError.notFound(`Attendance record ${attendanceId} not found`);
    await record.update(payload);
    return record;
}


// DAILY LOGS

export async function dailyLogsList(userId) {
    const logs = await EmployeeDailyLog.findAll({
        where: { userId }
    });

    return logs;
}

export async function addDailyLog(userId, payload) {
    const user = await User.findByPk(userId);
    if (!user) throw ApiError.notFound(`Employee ${userId} not found`);

    const logDate = todayDateOnly();

    const log = await EmployeeDailyLog.create({ userId, logDate, ...payload });

    return log;
}

export async function latestLog(userId) {
    const log = await EmployeeDailyLog.findOne({
        where: { userId },
        order: [['logDate', 'DESC']],
    });
    if (!log) throw ApiError.notFound(`No location logged yet for employee ${userId}`);
    return log;
}