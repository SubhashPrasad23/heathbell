import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
const LocalNotifications = registerPlugin('LocalNotifications');

/**
 * Schedules medication notifications based on specific days of the week and date
 * 
 * Rules:
 * 1. If medicine has a start date:
 *    - If start date is today, notifications begin today
 *    - If start date is in the future, notifications begin on that date
 * 2. If medicine has an end date:
 *    - Notifications will stop after end date
 * 3. If medicine has specified days of week:
 *    - Notifications will only trigger on those specific days
 */
export const scheduleMultipleNightlyNotifications = async (medicineList) => {
    if (Capacitor.getPlatform() !== 'android') {
        console.warn("This notification code only runs on Android native platform.");
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

    await cancelAllNotifications();

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

    medicineList.forEach((medicine) => {
        const { name, dosage, times, daysOfWeek, instructions, startDate, endDate } = medicine;

        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;

        if (endDateObj && endDateObj < today) {
            return;
        }


        times.forEach((time, index) => {
            const [hour, minute] = time.split(":").map(Number);
            const instruction = instructions?.[index] || instructions?.[0] || '';

            if (daysOfWeek && daysOfWeek.length > 0) {
                daysOfWeek.forEach(dayName => {
                    const dayNumber = weekDaysMap[dayName];

                    if (dayNumber === undefined) {
                        console.warn(`Invalid day name: ${dayName}`);
                        return;
                    }

                    const scheduledTime = getNextDayOfWeek(dayNumber, hour, minute);

                    if (endDateObj && scheduledTime > endDateObj) {
                        console.log(`Skipping notification for ${name} on ${scheduledTime.toDateString()}: after end date`);
                        return;
                    }

                    if (startDateObj && startDateObj > today) {
                        while (scheduledTime < startDateObj) {
                            scheduledTime.setDate(scheduledTime.getDate() + 7); // Add one week
                        }
                    }

                    notifications.push(createNotification(
                        notificationId++,
                        name,
                        dosage,
                        instruction,
                        scheduledTime,
                        dayNumber
                    ));
                });
            } else {
                const scheduledTime = new Date();
                scheduledTime.setHours(hour, minute, 0, 0);

                if (scheduledTime <= new Date()) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                }

                if (endDateObj && scheduledTime > endDateObj) {
                    return;
                }

                if (startDateObj && startDateObj > today) {
                    const daysUntilStart = Math.ceil((startDateObj - today) / (1000 * 60 * 60 * 24));
                    scheduledTime.setDate(scheduledTime.getDate() + daysUntilStart);

                    scheduledTime.setHours(hour, minute, 0, 0);
                }

                notifications.push(createNotification(
                    notificationId++,
                    name,
                    dosage,
                    instruction,
                    scheduledTime
                ));
            }
        });
    });

    if (notifications.length === 0) {
        console.log("No valid notifications to schedule");
        return false;
    }

    try {
        const notifs = await LocalNotifications.schedule({
            notifications,
        });

        console.log("Notifications scheduled:", JSON.stringify(notifs));
        return true;
    } catch (error) {
        console.error("Error scheduling notifications:", error);
        return false;
    }
};

function getNextDayOfWeek(dayOfWeek, hour, minute) {
    const now = new Date();
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    const currentDayOfWeek = date.getDay();

    let daysToAdd = dayOfWeek - currentDayOfWeek;

    if ((daysToAdd === 0 && date <= now) || daysToAdd < 0) {
        daysToAdd += 7;
    }

    date.setDate(date.getDate() + daysToAdd);

    console.log(`Next ${getDayName(dayOfWeek)} at ${hour}:${minute} is ${date.toISOString()}`);
    return date;
}

function getDayName(dayNumber) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
}

function createNotification(id, medicineName, dosage, instruction, scheduledTime, dayOfWeek = null) {
    const notificationObj = {
        title: `Time to take ${medicineName}`,
        body: `${dosage} — ${instruction ? `Take ${instruction.toLowerCase()}` : ''}`,
        id: id,
        schedule: {
            at: scheduledTime,
            allowWhileIdle: true,
            repeating: true
        },
        sound: "reminder",
        channelId: "daily_reminder_channel",
        extra: {
            data: JSON.stringify({
                medicineName: medicineName,
                dosage: dosage,
                instruction: instruction
            })
        },
        ongoing: true,
        autoCancel: false,
        smallIcon: "ic_notification",
        largeIcon: "ic_launcher"
    };

    if (dayOfWeek !== null) {
        notificationObj.schedule.every = "week";
        notificationObj.schedule.on = {
            weekday: dayOfWeek
        };
    }

    return notificationObj;
}

export const cancelAllNotifications = async () => {
    try {
        await LocalNotifications.cancelAll();
        console.log("All notifications cancelled");
        return true;
    } catch (error) {
        console.error("Error cancelling notifications:", error);
        return false;
    }
};

export const checkPendingNotifications = async () => {
    try {
        const pending = await LocalNotifications.getPending();
        console.log("Pending notifications:", JSON.stringify(pending));
        return pending;
    } catch (error) {
        console.error("Error checking pending notifications:", error);
        return [];
    }
};