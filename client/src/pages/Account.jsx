import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, UserPlus, Users, UserCircle } from "lucide-react";
import AddPatient from "../components/AddPatient";
import PatientsList from "../components/PatientsList";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Account = ({ patients, selectedPatient, setSelectedPatient }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
  });
  const navigate = useNavigate()
  const user = useSelector((store) => store?.user)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const slideIn = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const slideOut = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const options = [
    {
      id: "patients",
      path: "/account/list-of-patients",
      label: "Patients",
      icon: <Users size={20} className="text-teal-600" />,
      description: "View and manage your patients",
    },
    {
      id: "addPatient",
      path: "/account/add-patient",
      label: "Add Patient",
      icon: <UserPlus size={20} className="text-teal-600" />,
      description: "Add a new patient to your account",
    },
    {
      id: "logout",
      label: "Log Out",
      path: "/auth",

      icon: <LogOut size={20} className="text-red-500" />,
      description: "Sign out of your account",
      isLogout: true,
    },
  ];
  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`, {}, { withCredentials: true });
    navigate("/login");
  };


  return (
    <div className="h-full flex flex-col ">
      <div className=" p-5 mb-3">
        <div className="flex items-center space-x-4">
          <div className="md:w-16 md:h-16 h-12 w-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center text-white shrink-0">
            <UserCircle size={32} />
          </div>
          <div>
            <h3 className="font-semibold md:text-lg">{user?.fullName}</h3>
            <p className="text-gray-500 ">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              if (option.isLogout) {
                handleLogout();
              } else {
                navigate(option.path);  // programmatic navigation
              }
            }}
            // onClick={() => setActiveView(option.id)}
            className={`w-full bg-white shadow-inner border border-gray-300 shadow-gray-200 rounded-lg overflow-hidden cursor-pointer`}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full`}>{option.icon}</div>
                <div className="text-left">
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-gray-500">
                    {option.description}
                  </p>
                </div>
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </button>
        ))}
      </div>
      <div className="flex-grow mt-4 overflow-auto">
        <Outlet />
      </div>
    </div>


  );
};

export default Account;
