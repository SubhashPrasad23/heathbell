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
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useSelector((store) => store.user?._id);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.age ) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(formData.age) || +formData.age <= 0){
      newErrors.age = "Valid age is required";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.contact.trim() ) {
      newErrors.contact = "Contact is required";
      isValid = false;
    } else if ( !/^[0-9]{10}$/.test(formData.contact)){
      newErrors.contact = "Contact must be 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/${userId}/addPatient`,
        formData,
        { withCredentials: true }
      );
      console.log("Added Patient", response.data);

      setFormData({ name: "", age: "", gender: "", contact: "" });
      setErrors({});
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
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
      className="h-full flex flex-col hideScrollbar"
    >
      <div className="flex items-center mb-6 hideScrollbar">
        <button
          onClick={() => navigate("/account")}
          className="p-2 mr-3 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-teal-700">Add New Patient</h2>
      </div>

      <div className="flex-1 overflow-auto hideScrollbar">
        <PatientForm
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
          isSubmitting={isSubmitting}
          errors={errors}
        />
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <SuccessPopup
              message="Patient added successfully"
              onClose={() => {
                setShowSuccess(false);
                navigate("/account");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddPatient;
