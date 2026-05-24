import User from "../models/user.model.js"; // اتأكد من المسار
import Setting from "../models/settings.models.js";

export const resetDefaultLeaves = async () => {
    try {
        const setting = await Setting.findOne({});
        if (!setting) {
            console.log(
                "No setting found. please create a setting in the database."
            );
            return;
        }

        const defaultAnnualLeave = setting?.leaveBalance?.annual || 21;
        const defaultSickLeave = setting?.leaveBalance?.sick || 30;
        const defaultCasualLeave = setting?.leaveBalance?.casual || 6;

        const result = await User.updateMany(
            {
                "general.role": { $in: ["EMPLOYEE", "HR"] },
                "employee.status": "Active",
            },
            {
                $set: {
                    "employee.leaveBalance.annual": defaultAnnualLeave,
                    "employee.leaveBalance.sick": defaultSickLeave,
                    "employee.leaveBalance.casual": defaultCasualLeave,
                },
            }
        );

        console.log(
            `Leaves reset successfully for ${result.modifiedCount} active employees.`
        );
    } catch (error) {
        console.error("Error in resetDefaultLeaves job:", error);
    }
};
