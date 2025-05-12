import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
const LocalNotifications = registerPlugin('LocalNotifications');


export const scheduleNotifications = async (medicineList) => {
    console.log("=== STARTING NOTIFICATION SCHEDULING PROCESS ===");

    if (Capacitor.getPlatform() !== 'android') {
        return false;
    }

    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
        console.warn("Notification permission not granted.");
        return false;
    }

    await LocalNotifications.createChannel({
        id: "daily_reminder_channel",
        name: "Daily Reminder Channel",
        description: "Channel for daily reminder notifications",
        sound: "reminder",
        importance: 5,
        visibility: 1,
        vibration: true,
        lights: true
    });

    try {
        await cancelAllNotifications();
    } catch (error) {
        console.warn("Error while cancelling notifications:", error);
    }

    const notifications = [];
    let notificationId = 1000;

    const weekDaysMap = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Current date for scheduling: ${today.toString()}`);
    console.log(`Timezone offset: ${today.getTimezoneOffset()} minutes from UTC`);

    for (const medicine of medicineList) {
        const { name, dosage, times, daysOfWeek, instructions, startDate, endDate } = medicine;

        const startDateObj = startDate ? new Date(startDate) : null;
        if (startDateObj) {
            startDateObj.setHours(0, 0, 0, 0);
            console.log(`Start date parsed as: ${startDateObj.toString()} (local time)`);
        }

        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) {
            endDateObj.setHours(23, 59, 59, 999); 
            console.log(`End date parsed as: ${endDateObj.toString()} (local time)`);
        }

        if (endDateObj && endDateObj < today) {
            console.log(`Skipping medicine ${name}: end date ${endDate} has passed`);
            continue;
        }

        for (const time of times) {
            const [hour, minute] = time.split(":").map(Number);
            const instruction = Array.isArray(instructions) && instructions.length > 0
                ? instructions[times.indexOf(time)] || instructions[0] || ''
                : instructions || '';

            if (daysOfWeek && daysOfWeek.length > 0) {

                for (const dayName of daysOfWeek) {
                    const dayNumber = weekDaysMap[dayName];

                    if (dayNumber === undefined) {
                        continue;
                    }

                    let scheduledTime = getNextDayOfWeek(dayNumber, hour, minute);

                    if (startDateObj) {
                        console.log(`Checking start date: ${startDateObj.toString()}`);
                        console.log(`Initial scheduled time: ${scheduledTime.toString()}`);
                        console.log(`Comparison result: scheduledTime < startDateObj = ${scheduledTime < startDateObj}`);

                        if (scheduledTime < startDateObj) {
                            const originalDate = new Date(scheduledTime);

                            while (scheduledTime < startDateObj) {
                                scheduledTime.setDate(scheduledTime.getDate() + 7);
                                console.log(`Shifting date forward by 1 week to: ${scheduledTime.toString()}`);
                            }

                        }
                    }

                    if (endDateObj && scheduledTime > endDateObj) {
                        continue;
                    }

                    console.log(`Creating weekly notification for ${name} on ${dayName} at ${hour}:${minute}`);
                    notifications.push(createNotification(
                        notificationId++,
                        name,
                        dosage,
                        instruction,
                        scheduledTime,
                        dayNumber
                    ));
                }
            } else {
                console.log(`Setting up daily notification for ${name} at ${hour}:${minute}`);

                let scheduledTime = new Date();
                scheduledTime.setHours(hour, minute, 0, 0);
                console.log(`Initial scheduled time: ${scheduledTime.toISOString()}`);

                if (scheduledTime <= new Date()) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                    console.log(`Time ${hour}:${minute} already passed today, scheduling for tomorrow: ${scheduledTime.toISOString()}`);
                }

                if (startDateObj) {
                    

                    if (startDateObj > today) {
                        const originalScheduledTime = new Date(scheduledTime);
                        scheduledTime = new Date(startDateObj);
                        scheduledTime.setHours(hour, minute, 0, 0);

                        const currentTime = new Date();
                        if (startDateObj.getDate() === currentTime.getDate() &&
                            (hour < currentTime.getHours() ||
                                (hour === currentTime.getHours() && minute <= currentTime.getMinutes()))) {
                            scheduledTime.setDate(scheduledTime.getDate() + 1);
                        }

                    }

                }

                if (endDateObj && scheduledTime > endDateObj) {
                    continue;
                }

                notifications.push(createDailyNotification(
                    notificationId++,
                    name,
                    dosage,
                    instruction,
                    scheduledTime
                ));
            }
        }
    }

    if (notifications.length === 0) {
        return false;
    }


    try {
        const notifs = await LocalNotifications.schedule({
            notifications,
        });

        return true;
    } catch (error) {
        console.error("Error scheduling notifications:", error);
        return false;
    }
};


function getNextDayOfWeek(dayOfWeek, hour, minute) {
    const now = new Date();

    const result = new Date(now);
    result.setHours(hour, minute, 0, 0);

    const currentDay = now.getDay();
    let daysToAdd = (dayOfWeek - currentDay + 7) % 7;

    if (daysToAdd === 0) {
        if (hour < now.getHours() ||
            (hour === now.getHours() && minute <= now.getMinutes())) {
            daysToAdd = 7;
        }
    }

    result.setDate(result.getDate() + daysToAdd);
   

    return result;
}


function getDayName(dayNumber) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
}


function createNotification(id, medicineName, dosage, instruction, scheduledTime, dayOfWeek) {
    const notificationTime = new Date(scheduledTime);

    notificationTime.setSeconds(0, 0);

   

    const notificationObj = {
        title: `Time to take ${medicineName}`,
        body: `${dosage}${instruction ? ` — Take ${instruction.toLowerCase()}` : ''}`,
        id: id,
        schedule: {
            at: notificationTime,
            allowWhileIdle: true,
            repeating: true,
            every: "week",
            on: {
                weekday: dayOfWeek
            }
        },
        sound: "reminder",
        channelId: "daily_reminder_channel",
        extra: {
            data: JSON.stringify({
                medicineName: medicineName,
                dosage: dosage,
                instruction: instruction,
                scheduled: notificationTime.toISOString(),
                scheduledLocalTime: notificationTime.toLocaleString(),
                day: getDayName(dayOfWeek)
            })
        },
        ongoing: false,
        autoCancel: true,
        smallIcon: "ic_notification",
        largeIcon: "ic_launcher"
    };

    return notificationObj;
}


function createDailyNotification(id, medicineName, dosage, instruction, scheduledTime) {
    const notificationTime = new Date(scheduledTime);

    notificationTime.setSeconds(0, 0);


    const notificationObj = {
        title: `Time to take ${medicineName}`,
        body: `${dosage}${instruction ? ` — Take ${instruction.toLowerCase()}` : ''}`,
        id: id,
        schedule: {
            at: notificationTime,
            allowWhileIdle: true,
            repeating: true,
            every: "day"
        },
        sound: "reminder",
        channelId: "daily_reminder_channel",
        extra: {
            data: JSON.stringify({
                medicineName: medicineName,
                dosage: dosage,
                instruction: instruction,
                scheduled: notificationTime.toISOString(),
                scheduledLocalTime: notificationTime.toLocaleString(),
                daily: true
            })
        },
        ongoing: false,
        autoCancel: true,
        smallIcon: "ic_notification",
        largeIcon: "ic_launcher"
    };

    return notificationObj;
}

export const cancelAllNotifications = async () => {
    try {
        const pending = await LocalNotifications.getPending();

        if (pending && pending.notifications && pending.notifications.length > 0) {
            console.log(`Found ${pending.notifications.length} pending notifications to cancel`);

            const platform = Capacitor.getPlatform();
            if (platform !== 'android') {
                try {
                    await LocalNotifications.cancelAll();
                    console.log("Successfully cancelled all notifications at once");
                    return true;
                } catch (bulkError) {
                    console.warn("Bulk cancellation failed, trying individual cancellation", bulkError);
                }
            }

            for (const notification of pending.notifications) {
                try {
                    await LocalNotifications.cancel({
                        notifications: [{ id: notification.id }]
                    });
                    console.log(`Cancelled notification ID: ${notification.id}`);
                } catch (innerError) {
                    console.warn(`Failed to cancel notification ID: ${notification.id}`, innerError);
                }
            }
        } else {
            console.log("No pending notifications to cancel");
        }

        return true;
    } catch (error) {
        console.error("Error during notification cancellation process:", error);
        throw error;
    }
};


export const checkPendingNotifications = async () => {
    try {
        const pending = await LocalNotifications.getPending();

        if (pending && pending.notifications && pending.notifications.length > 0) {
            console.log(`Found ${pending.notifications.length} pending notifications`);

            pending.notifications.forEach((notification, index) => {
                

                if (notification.schedule) {
                    if (notification.schedule.at) {
                        console.log(`  Scheduled at: ${new Date(notification.schedule.at).toLocaleString()}`);
                    }
                    if (notification.schedule.every) {
                        console.log(`  Repeating: ${notification.schedule.every}`);
                    }
                    if (notification.schedule.on && notification.schedule.on.weekday !== undefined) {
                        console.log(`  On day: ${getDayName(notification.schedule.on.weekday)}`);
                    }
                }

                if (notification.extra && notification.extra.data) {
                    try {
                        const extraData = JSON.parse(notification.extra.data);
                        console.log(`  Extra data: ${JSON.stringify(extraData)}`);
                    } catch {
                        console.log(`  Extra data: ${notification.extra.data} (failed to parse)`);
                    }
                }
            });
        } else {
            console.log("No pending notifications found");
        }

        return pending;
    } catch (error) {
        console.error("Error checking pending notifications:", error);
        return { notifications: [] };
    }
};
export const checkNotificationPermission = async () => {
    try {
        let permission = await LocalNotifications.checkPermissions();
        console.log("Initial notification permission status:", permission.display);

        if (permission.display !== 'granted') {
            permission = await LocalNotifications.requestPermissions();
            console.log("Permission after request:", permission.display);
        }

        return permission;
    } catch (error) {
        console.error("Error checking/requesting notification permissions:", error);
        return { display: 'unknown' };
    }
  };




export const cancelNotificationById = async (notificationId) => {
    try {
        await LocalNotifications.cancel({
            notifications: [{ id: notificationId }]
        });
        console.log(`Notification with ID ${notificationId} cancelled successfully`);
        return true;
    } catch (error) {
        console.error(`Error cancelling notification ID ${notificationId}:`, error);
        return false;
    }
};