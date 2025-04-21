import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import BottomTab from "../components/BottomTab";

const MainLayout = () => {
  return (
    <div className="w-full flex md:flex-row flex-col h-screen ">
      <div className="2xl:w-2/12 lg:w-4/12 w-5/12 md:block hidden">
        <Sidebar />
      </div>
      <div className="md:w-10/12 w-full  h-full">
        <Outlet />
      </div>
      <div className=" w-full md:hidden block">
        <BottomTab />
      </div>
    </div>
  );
};

export default MainLayout;
