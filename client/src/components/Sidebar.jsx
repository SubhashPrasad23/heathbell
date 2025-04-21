import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const options = [
    { name: "Home", path: "/" },
    { name: "Add medicine", path: "add_medicine" },
    { name: "Add patient", path: "add_patient" },
    { name: "search", path: "search" },
  ];

  return (
    <div className="bg-teal-600 h-full w-full px-5 py-10 flex flex-col shrink-0">
      <h1 className=" px-10">Logo</h1>

      <div className="h-[50vh] w-full place-content-center">
        <ul className="space-y-2">
          {options.map((option, index) => (
            <li key={index} className="shadow-[0px_1px_5px_1px_black] rounded-md">
              <NavLink
                to={option.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded cursor-pointer  ${
                    isActive ? "bg-teal-500 text-white" : "bg-white text-black"
                  } hover:bg-teal-400 hover:text-white transition rounded-md`
                }
              >
                {option.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full flex-1 flex items-end">
        <button className="text-left cursor-pointer w-full bg-white px-10 py-3 rounded-md shadow-[0px_1px_5px_1px_black] hover:bg-red-500 hover:text-white tracking-wider">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
