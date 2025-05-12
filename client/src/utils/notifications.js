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
    console.log("=== STARTING NOTIFICATION SCHEDULING PROCESS ===");
    console.log(`Received medicine list with ${medicineList?.length || 0} items`);

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

    try {
        console.log("Cancelling all existing notifications before scheduling new ones");
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

    // Get today's date at midnight in the user's local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Current date for scheduling: ${today.toString()}`);
    console.log(`Timezone offset: ${today.getTimezoneOffset()} minutes from UTC`);

    // Process each medicine
    for (const medicine of medicineList) {
        const { name, dosage, times, daysOfWeek, instructions, startDate, endDate } = medicine;

        console.log(`\n=== Processing medicine: ${name} ===`);
        console.log(`Dosage: ${dosage}`);
        console.log(`Times: ${JSON.stringify(times)}`);
        console.log(`Days of Week: ${JSON.stringify(daysOfWeek)}`);
        console.log(`Start Date: ${startDate || 'Not specified'}`);
        console.log(`End Date: ${endDate || 'Not specified'}`);

        // Convert string dates to Date objects with time set to midnight in local timezone
        const startDateObj = startDate ? new Date(startDate) : null;
        if (startDateObj) {
            startDateObj.setHours(0, 0, 0, 0);
            console.log(`Start date parsed as: ${startDateObj.toString()} (local time)`);
        }

        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) {
            endDateObj.setHours(23, 59, 59, 999); // End of day for end date
            console.log(`End date parsed as: ${endDateObj.toString()} (local time)`);
        }

        // Skip if end date is in the past
        if (endDateObj && endDateObj < today) {
            console.log(`Skipping medicine ${name}: end date ${endDate} has passed`);
            continue;
        }

        // Process each time for this medicine
        for (const time of times) {
            console.log(`\n--- Processing time: ${time} for ${name} ---`);
            const [hour, minute] = time.split(":").map(Number);
            const instruction = Array.isArray(instructions) && instructions.length > 0
                ? instructions[times.indexOf(time)] || instructions[0] || ''
                : instructions || '';

            // If specific days are configured
            if (daysOfWeek && daysOfWeek.length > 0) {
                console.log(`Setting up notifications for specific days: ${daysOfWeek.join(', ')}`);

                for (const dayName of daysOfWeek) {
                    const dayNumber = weekDaysMap[dayName];

                    if (dayNumber === undefined) {
                        console.warn(`Invalid day name: ${dayName}`);
                        continue;
                    }

                    console.log(`\n--- Setting up notification for ${name} on ${dayName} at ${hour}:${minute} ---`);

                    // Get next occurrence of this day
                    let scheduledTime = getNextDayOfWeek(dayNumber, hour, minute);
                    console.log(`Initial scheduled time: ${scheduledTime.toISOString()}`);

                    // Handle start date restriction
                    if (startDateObj) {
                        console.log(`Checking start date: ${startDateObj.toString()}`);
                        console.log(`Initial scheduled time: ${scheduledTime.toString()}`);
                        console.log(`Comparison result: scheduledTime < startDateObj = ${scheduledTime < startDateObj}`);

                        // If scheduled date is before start date, find first valid occurrence after start date
                        if (scheduledTime < startDateObj) {
                            const originalDate = new Date(scheduledTime);

                            // Keep adding weeks until we're after the start date
                            while (scheduledTime < startDateObj) {
                                scheduledTime.setDate(scheduledTime.getDate() + 7);
                                console.log(`Shifting date forward by 1 week to: ${scheduledTime.toString()}`);
                            }

                            console.log(`Adjusted notification date from ${originalDate.toString()} to ${scheduledTime.toString()} due to start date restriction`);
                        }
                    }

                    // Skip if the adjusted date is after end date
                    if (endDateObj && scheduledTime > endDateObj) {
                        console.log(`Comparing: ${scheduledTime.toString()} > ${endDateObj.toString()} = ${scheduledTime > endDateObj}`);
                        console.log(`Skipping notification for ${name} on ${dayName}: after end date ${endDate}`);
                        continue;
                    }

                    // Create and add the notification
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

                // If the time has already passed today, schedule for tomorrow
                if (scheduledTime <= new Date()) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                    console.log(`Time ${hour}:${minute} already passed today, scheduling for tomorrow: ${scheduledTime.toISOString()}`);
                }

                // Handle start date restriction
                if (startDateObj) {
                    console.log(`Checking start date: ${startDateObj.toString()}`);
                    console.log(`Today's date for comparison: ${today.toString()}`);
                    console.log(`Comparison result: startDateObj > today = ${startDateObj > today}`);

                    if (startDateObj > today) {
                        // If start date is in the future, schedule from start date
                        console.log(`Start date is in the future, adjusting scheduled time`);
                        const originalScheduledTime = new Date(scheduledTime);
                        scheduledTime = new Date(startDateObj);
                        scheduledTime.setHours(hour, minute, 0, 0);

                        // If the time has already passed on start date, schedule for next day
                        const currentTime = new Date();
                        if (startDateObj.getDate() === currentTime.getDate() &&
                            (hour < currentTime.getHours() ||
                                (hour === currentTime.getHours() && minute <= currentTime.getMinutes()))) {
                            scheduledTime.setDate(scheduledTime.getDate() + 1);
                            console.log(`Time has already passed on start date, scheduling for next day: ${scheduledTime.toString()}`);
                        }

                        console.log(`Changed scheduled time from ${originalScheduledTime.toString()} to ${scheduledTime.toString()}`);
                    }

                    console.log(`Adjusted scheduled time for start date: ${scheduledTime.toString()}`);
                }

                if (endDateObj && scheduledTime > endDateObj) {
                    console.log(`Skipping notification for ${name}: scheduled time is after end date ${endDate}`);
                    continue;
                }

                console.log(`Creating daily notification for ${name} at ${hour}:${minute}`);
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
        console.log("No valid notifications to schedule");
        return false;
    }

    console.log(`Preparing to schedule ${notifications.length} notifications`);

    try {
        const notifs = await LocalNotifications.schedule({
            notifications,
        });

        console.log(`Successfully scheduled ${notifs.notifications?.length || 0} notifications`);
        return true;
    } catch (error) {
        console.error("Error scheduling notifications:", error);
        return false;
    }
};


function getNextDayOfWeek(dayOfWeek, hour, minute) {
    // Get the current date and time in the user's local timezone
    const now = new Date();
    console.log(`Calculating next ${getDayName(dayOfWeek)} from current time: ${now.toString()}`);
    console.log(`Current day: ${getDayName(now.getDay())}, Current hour: ${now.getHours()}, Current minute: ${now.getMinutes()}`);

    // Create a date object for today (in local timezone)
    const result = new Date(now);
    result.setHours(hour, minute, 0, 0);

    // Calculate days until the next occurrence of this day of week
    const currentDay = now.getDay();
    let daysToAdd = (dayOfWeek - currentDay + 7) % 7;

    // If it's the same day (daysToAdd === 0) and the time has already passed, we need to go to next week
    if (daysToAdd === 0) {
        if (hour < now.getHours() ||
            (hour === now.getHours() && minute <= now.getMinutes())) {
            daysToAdd = 7;
            console.log(`Time ${hour}:${minute} has already passed today, scheduling for next week`);
        }
    }

    result.setDate(result.getDate() + daysToAdd);
    console.log(`Next ${getDayName(dayOfWeek)} calculated: ${result.toString()}`);
    console.log(`In local time: ${result.toLocaleString()}`);

    return result;
}


function getDayName(dayNumber) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
}


function createNotification(id, medicineName, dosage, instruction, scheduledTime, dayOfWeek) {
    const notificationTime = new Date(scheduledTime);

    notificationTime.setSeconds(0, 0);

    console.log(`Creating notification #${id} for ${medicineName}:`);
    console.log(`- First occurrence: ${notificationTime.toString()}`);
    console.log(`- Local time: ${notificationTime.toLocaleString()}`);
    console.log(`- Weekly on ${getDayName(dayOfWeek)}`);
    console.log(`- Dosage: ${dosage}`);
    console.log(`- Instruction: ${instruction}`);

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

    // Ensure we're working with a clean time
    notificationTime.setSeconds(0, 0);

    console.log(`Creating daily notification #${id} for ${medicineName}:`);
    console.log(`- First occurrence: ${notificationTime.toString()}`);
    console.log(`- Local time: ${notificationTime.toLocaleString()}`);
    console.log(`- Repeating: Daily`);
    console.log(`- Dosage: ${dosage}`);
    console.log(`- Instruction: ${instruction}`);

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
        console.log("=== PENDING NOTIFICATIONS ===");

        if (pending && pending.notifications && pending.notifications.length > 0) {
            console.log(`Found ${pending.notifications.length} pending notifications`);

            // Log each notification for debugging
            pending.notifications.forEach((notification, index) => {
                console.log(`\nNotification #${index + 1}:`);
                console.log(`  ID: ${notification.id}`);
                console.log(`  Title: ${notification.title}`);
                console.log(`  Body: ${notification.body}`);

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

// export const checkNotificationPermission = async () => {
//     try {
//         const permission = await LocalNotifications.checkPermissions();
//         console.log("Notification permission status:", permission.display);
//         return permission;
//     } catch (error) {
//         console.error("Error checking notification permissions:", error);
//         return { display: 'unknown' };
//     }
// };


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