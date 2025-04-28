import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import PatientForm from "./PatientForm";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "./SuccessPopup";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = useSelector((store) => store.user?._id);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("ccclickedddddddd");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/${userId}/addPatient`,
        formData,
        { withCredentials: true }
      );
      console.log(response);
      setFormData({
        name: "",
        age: "",
        gender: "",
        contact: "",
      });
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
    }
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      className="h-full flex flex-col"
    >
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/account")}
          className="p-2 mr-3 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-teal-700">Add New Patient</h2>
      </div>
      <div className="">
        <PatientForm
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      </div>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }} // 0.5 seconds
            className="fixed inset-0  flex items-center justify-center  p-4 z-50"
          >
            <SuccessPopup message="added patient"/>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddPatient;
