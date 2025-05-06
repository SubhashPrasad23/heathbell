import "./index.css";
import { useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { checkPendingNotifications, scheduleMultipleNightlyNotifications } from "./utils/notifications";
import { useSelector } from "react-redux";


function App() {

  const medicineList = useSelector((store) => store?.medicine)
  useEffect(() => {
    const setupNotification = async () => {
      try {

        if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
          const result = await scheduleMultipleNightlyNotifications(medicineList);
          if (result) {
            const pending = await checkPendingNotifications();
            console.log(`Found ${pending.notifications?.length || 0} pending notifications`);
          }
        }
      } catch (error) {
        console.error("Error in notification setup:", error);
      }
    };
    setupNotification();
    document.addEventListener("resume", setupNotification);
    return () => {
      document.removeEventListener("resume", setupNotification);
    };
  }, [medicineList]);
  return <MainLayout />;
}

export default App;
