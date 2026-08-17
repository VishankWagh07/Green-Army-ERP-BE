import cron from 'node-cron';
import env from '../config/env.js'
import { sendDonorOccasionReminder, sendTodaysWateringReminder } from './reminder.js';

export const dailyScheduler = () => {

    const time = env.WATERING_REMINDER_TIME.split(':');

    const hrs = Number(time[0]);
    const mins = Number(time[1]);
    const secs = Number(time[2] || 0);

    const expr = `${secs} ${mins} ${hrs} * * *`;

    cron.schedule(expr, () => {
        console.log('Running a task daily at reminder time');

        sendDonorOccasionReminder();

        sendTodaysWateringReminder();
    });
}