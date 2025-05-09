import React from "react";
import { House, Pill, Search, CircleUserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomTab = () => {
  const options = [
    { path: "/", icon: <House size={20} />, name: "Home" },
    { path: "/add_medicine", icon: <Pill size={20} />, name: "Add" },
    { path: "/search", icon: <Search size={20} />, name: "Search" },
    { path: "/account", icon: <CircleUserRound size={20} />, name: "Account" },
  ];

  return (
    <div className="w-full shadow-[0px_0px_5px_1px_black] rounded-t-3xl">
      <div className="flex items-center justify-between bg-teal-600 px-5 py-2 rounded-t-3xl shadow-inner shadow-teal-500">
        <ul className="flex items-center flex-1 justify-between">
          {options.map((option, index) => (
            <li key={index}>
              <NavLink
                to={option.path}
                className="flex flex-col items-center gap-0.5 text-white"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-1.5 shadow-inner rounded-full transition ${isActive
                          ? "bg-teal-500 shadow-teal-400"
                          : "bg-white text-teal-700 shadow-gray-300"
                        } hover:bg-teal-400 hover:text-white`}
                    >
                      {option.icon}
                    </div>
                    <span className="text-sm font-semibold tracking-wide">{option.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BottomTab;
