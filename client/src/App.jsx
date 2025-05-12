import "./index.css";
import { useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout";
import { checkPendingNotifications, scheduleMultipleNightlyNotifications, checkNotificationPermission } from "./utils/notifications";
import { useSelector } from "react-redux";
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

function App() {
  const medicineList = useSelector((store) => store?.medicine || []);

  // Setup notifications
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (Capacitor.isPluginAvailable('LocalNotifications') && Capacitor.getPlatform() === 'android') {
          console.log("=== NOTIFICATION SETUP TRIGGERED ===");
          console.log(`Medicine list contains ${medicineList.length} items`);

          // First check permissions
          const permissionStatus = await checkNotificationPermission();

          if (permissionStatus.display !== 'granted') {
            console.log("Notification permission not granted, skipping setup");
            return;
          }

          // Schedule notifications
          const result = await scheduleMultipleNightlyNotifications(medicineList);
          console.log(`Notification scheduling result: ${result ? 'Success' : 'Failed'}`);

          if (result) {
            // Check what was actually scheduled
            const pending = await checkPendingNotifications();
            console.log(`Final check: Found ${pending.notifications?.length || 0} pending notifications`);
          }
        } else {
          console.log("LocalNotifications plugin not available or not on Android platform");
        }
      } catch (error) {
        console.error("Error in notification setup:", error);
      }
    };

    // Run on component mount and whenever medicine list changes
    setupNotifications();

    const addAppStateListeners = () => {
      if (Capacitor.isNativePlatform()) {
        document.addEventListener("resume", handleAppResume);

        document.addEventListener("appStateChange", handleAppStateChange);
      }
    };

    const handleAppResume = () => {
      console.log("App resumed - checking notifications");
      setupNotifications();
    };

    const handleAppStateChange = (state) => {
      if (state.isActive) {
        console.log("App became active - checking notifications");
        setupNotifications();
      }
    };

    addAppStateListeners();

    return () => {
      if (Capacitor.isNativePlatform()) {
        document.removeEventListener("resume", handleAppResume);
        document.removeEventListener("appStateChange", handleAppStateChange);
      }
    };
  }, [medicineList]); 

  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        if (Capacitor.isPluginAvailable('StatusBar') && Capacitor.isNativePlatform()) {
          console.log("Setting up status bar");
          await StatusBar.setBackgroundColor({ color: '#ffffffff' });
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setOverlaysWebView({ overlay: false });
        }
      } catch (error) {
        console.error('StatusBar setup error:', error);
      }
    };
    setupStatusBar();
  }, []);

  return (
      <MainLayout />
      
    
    
     
  );
}

export default App;