import Notification from "../models/notification.model.js";

export const sendNotification = async (io, data) => {
    try {
        const newNotification = await Notification.create({
            recipient: data.recipient,
            sender: data.sender,
            title: data.title,
            message: data.message,
            type: data.type,
            relatedId: data.relatedId,
        });

        if (data.targetRoom === "HR_Room") {
            io.to("HR_Room").emit("newNotification", newNotification);
        } else {
            io.to(data.recipient.toString()).emit(
                "newNotification",
                newNotification
            );
        }

        return newNotification;
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
