import { Session, User } from "./auth.model.js";
import { Donation, Donor } from "./donor.model.js";
import { Attendance, EmployeeDailyLog } from "./employee.model.js";
import Photo from "./photo.model.js";
import { Plantation } from "./plantation.model.js";
import { Team } from "./team.model.js";
import { WateringLocation, WateringSchedule } from "./watering.model.js";

import { sequelize } from "../config/db.js";


// 2. Put EVERY model inside this registry object
const models = {
  User,
  Session,
  Donor,
  Donation,
  WateringLocation,
  WateringSchedule,
  Team,
  Plantation,
  EmployeeDailyLog,
  Attendance,
  Photo,
};

// 3. Run the loop to associate them securely
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// 4. Export them centrally for your app to use
export { sequelize, models };
