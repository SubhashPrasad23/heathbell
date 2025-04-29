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
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }} // 0.5 seconds
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
