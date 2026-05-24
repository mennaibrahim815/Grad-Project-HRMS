import cron from "node-cron";
import Setting from "../models/settings.models.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { markAbsentEmployees } from "../services/attendance.service.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const scheduleAttendanceJob = async () => {
    try {
        const setting = await Setting.findOne({});
        const timeZone = setting?.timeZone || "Africa/Cairo";
        cron.schedule(
            "59 23 * * *",
            () => {
                console.log("Executing Attendance Job ");
                markAbsentEmployees();
            },
            {
                timezone: timeZone,
            }
        );
    } catch (error) {
        console.error("Error scheduling attendance job:", error);
    }
};

export default scheduleAttendanceJob;
