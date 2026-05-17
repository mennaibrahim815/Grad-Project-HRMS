import cron from "node-cron";
import Setting from "../models/settings.models.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { resetDefaultLeaves } from "../services/resetDefaultLeaves.service.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const scheduleresetDefaultLeaves = async () => {
    try {
        const setting = await Setting.findOne({});
        const timeZone = setting?.timeZone || "Africa/Cairo";

        cron.schedule(
            "0 0 1 1 *",
            () => {
                console.log(
                    "Happy New Year! Executing resetDefaultLeaves Job..."
                );
                resetDefaultLeaves();
            },
            {
                timezone: timeZone,
            }
        );
        console.log(
            "Scheduled: Leave Balances Reset (Runs every Jan 1st at 00:00)"
        );
    } catch (error) {
        console.error("Error scheduling resetDefaultLeaves job:", error);
    }
};

export default scheduleresetDefaultLeaves;
