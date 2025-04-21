import React from "react";
import { House, Pill, Search, UserPlus,CircleUserRound } from "lucide-react";

const BottomTab = () => {
  const options = [
    {  path: "/", icon: <House /> },
    { path: "/add_medicine", icon: <Pill /> },
    {  path: "/add_patient", icon: <UserPlus /> },
    {  path: "/search", icon: <Search /> },
  ];
  return (
    <div className="w-full bg-teal-600 p-3 rounded-t-3xl flex items-center justify-between">
      <ul className="flex items-center flex-1 ">
        {options.map((option) => (
          <li className="flex-1 flex flex-col place-items-center text-white hover:bg-white hover:text-teal-600 cursor-pointer p-2 rounded-lg">
            {option.icon}
          </li>
        ))}
      </ul>
      <button className="place-items-center text-white hover:bg-white hover:text-teal-600 p-2  rounded-lg">
      <CircleUserRound/>

      </button>
    </div>
  );
};

export default BottomTab;
