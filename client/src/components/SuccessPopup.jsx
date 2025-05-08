import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPopup = ({ message, onClose }) => {


    const navigate=useNavigate()



    const handleGoHome = () => {
      if (onClose) onClose(); // Hide the popup
      setTimeout(() => {
        navigate("/"); // Ensure navigation happens after unmount
      }, 100); // Small delay ensures React finishes unmounting
    };

  return (
    <div className=" p-5 relative max-w-md w-full ">
      <div className="absolute left-1/2 shadow-[0px_2px_20px_2px_teal] -translate-x-1/2  top-0 bg-white p-3 rounded-full text-teal-400  ">
        <div className="animate-pulse">
          <CheckCircle />
        </div>
      </div>

      <div className=" w-full bg-teal-500  p-10  rounded-2xl shadow-inner shadow-teal-200 z-50 flex items-center justify-center text-center flex-col gap-4">
        <span className="text-white tracking-wide">
          You have successfully {message} !
        </span>

        <button onClick={handleGoHome}
 className=" bg-white py-2 px-4 rounded-lg shadow-inner shadow-gray-300 cursor-pointer text-teal-700">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
