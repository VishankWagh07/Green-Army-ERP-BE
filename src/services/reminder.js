import { Op } from "sequelize";
import { User } from "../models/auth.model.js";
import { getReminderDonors } from "../modules/donor/donor.service.js"
import { getReminderWateringLocations } from "../modules/watering/watering.service.js";
import { getAnniversaryReminderHTML, getBirthdayReminderHTML, getWateringReminderHTML } from "../utils/reminderHTML.js";
import { sendMail } from "./sendMail.js";
import { USER_ROLES } from "../constants/auth.js";

export const sendDonorOccasionReminder = async() => {

    const {birthDayDonors, anniversaryDonors} = await getReminderDonors();

    console.log("reminder don", {birthDayDonors, anniversaryDonors});
    
    // loop on donors and call sendMail with specific HTML

    birthDayDonors.forEach(donor => {
        const html = getBirthdayReminderHTML(donor);

        const subject = "Wishing you a Very Happy Birthday in Advance"

        sendMail({to: donor.email, subject, html});
    });

    anniversaryDonors.forEach(donor => {
        const html = getAnniversaryReminderHTML(donor);
        
        const subject = "Wishing you a Very Happy Anniversary in Advance"

        sendMail({to: donor.email, subject, html});
    });

}

export const sendTodaysWateringReminder = async() => {

    const wateringLocations = await getReminderWateringLocations();

    console.log("! loc", wateringLocations, wateringLocations.length);
    
    if(!wateringLocations || wateringLocations.length == 0) return;

    const users = await User.findAll({
        where: {
            role: {
                [Op.in]: [USER_ROLES.ADMIN, USER_ROLES.TEAM_MANAGER]
            }
        }
    });

    console.log("reminder water loc", wateringLocations, users);

    const html = getWateringReminderHTML(wateringLocations);

    const subject = "Daily Watering Reminder"

    users.forEach(user => {
        sendMail({to: user.email, subject, html});
    });

}