import React from "react";
import { Outlet } from "react-router-dom";
import BottomTab from "../components/BottomTab";
import Header from "../components/Header";
// import { scheduleTestNotification } from "../utils/notifications";

const MainLayout = () => {
  return (
    <div className="w-full h-screen">
      <div className="h-full flex flex-col lg:max-w-lg md:max-w-md w-full mx-auto border-x border-teal-600 bg-[rgb(236,242,248)]">
        <Header />
        <div className="flex-1 overflow-auto p-5">
          <Outlet />
        </div>
        {/* <button onClick={scheduleTestNotification}>click </button> */}
        <BottomTab />
      </div>
    </div>
  );
};

export default MainLayout;
