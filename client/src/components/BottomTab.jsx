import React from "react";
import { House, Pill, Search, UserPlus, CircleUserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomTab = () => {
  const options = [
    { path: "/", icon: <House size={30}/> },
    { path: "/add_medicine", icon: <Pill size={30} /> },
    // { path: "/add_patient", icon: <UserPlus /> },
    { path: "/search", icon: <Search size={30} /> },
    { path: "/account", icon: <CircleUserRound size={30} /> },
  ];
  return (
    <div className="w-full shadow-[0px_0px_5px_1px_black] rounded-t-3xl ">
      <div className="flex items-center justify-between bg-teal-600 px-5 py-3 rounded-t-3xl shadow-inner shadow-teal-500">
        <ul className="flex items-center flex-1 justify-between ">
          {options.map((option, index) => (
            <li key={index} className="">
              <NavLink
                to={option.path}
                className={({ isActive }) =>
                  `block p-1.5 rounded cursor-pointer shadow-inner ${
                    isActive
                      ? "bg-teal-500 text-white shadow-teal-400"
                      : "bg-white text-teal-700 shadow-gray-300"
                  } hover:bg-teal-400 hover:text-white transition rounded-full`
                }
              >
                {option.icon}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BottomTab;
