import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Calendar } from "lucide-react";
import axios from "axios";
import SuccessPopup from "../components/SuccessPopup";
import MedicineForm from "../components/MedicineForm";

const AddMedicine = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const selectedId = localStorage.getItem("selectedPatientId");
  const [formData, setFormData] = useState({
    name: "",
    typeofMedicine: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
  });
  const [times, setTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedInstruction, setSelectedInstruction] = useState([]);
  const [errors, setErrors] = useState({ name: "", typeofMedicine: "", dosage: "", frequency: "", startDate: "", endDate: "", times: "", selectedDays: "", selectedInstruction: "" });

  const validateForm = () => {

    let isValid = true
    const newErrors = { name: "", dosage: "", frequency: "", startDate: "", endDate: "", times: "", selectedDays: "", selectedInstruction: "" }


    if (!formData.name) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.dosage) {
      newErrors.dosage = "Dosage is required"
      isValid = false
    }


    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required"
      isValid = false
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required"
      isValid = false
    }


    if (!formData.endDate) {
      newErrors.endDate = "End Date  is required"
      isValid = false
    }

    if (!times || times.length === 0 || times.some(t => !t)) {
      newErrors.times = "All time fields are required";
      isValid = false;
    }

    if (!selectedDays.length > 0) {
      newErrors.selectedDays = "Day is required"
      isValid = false
    }

    if (!selectedInstruction.length > 0) {
      newErrors.selectedInstruction = "Instruction is required"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/medicine/${selectedId}/addmedicines`,
        {
          name: formData.name,
          typeofMedicine: formData.typeofMedicine,
          dosage: formData.dosage,
          frequency: formData.frequency,
          startDate: formData.startDate,
          endDate: formData.endDate,
          times: times,
          daysOfWeek: selectedDays,
          instructions: selectedInstruction,
        },
        { withCredentials: true }
      );
      setFormData({
        name: "",
        typeofMedicine: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
      });
      setSelectedInstruction([]);
      setSelectedDays([]);
      setTimes([]);
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className=" w-full h-full flex flex-col flex-1 ">
      <h2 className="text-2xl font-semibold text-teal-700 mb-5 flex items-center font-MontSerrat">
        <Pill className="mr-2 text-teal-600" size={24} />
        Add Medicine
      </h2>

      <MedicineForm
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        times={times}
        setTimes={setTimes}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        selectedInstruction={selectedInstruction}
        setSelectedInstruction={setSelectedInstruction}
        errors={errors}
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0  flex items-center justify-center  p-4 z-50"
          >
            <SuccessPopup message="added medicine" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddMedicine;
