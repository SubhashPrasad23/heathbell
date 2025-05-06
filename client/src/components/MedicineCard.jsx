import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { removeMedicine } from "../features/medicine/medicine";
import { useDispatch } from "react-redux";

const MedicineCard = ({
  medicine,
  setIsEditing,
  setEditingMedicine,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const storedId = localStorage.getItem("selectedPatientId");

  const handleDeleteMedicine = async (medicineId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/medicine/${storedId}/${medicineId}/deleteMedicine`,
        {},
        { withCredentials: true }
      );
      dispatch(removeMedicine(medicineId));
    } catch (error) {
      console.log(error);
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      typeofMedicine: medicine.typeofMedicine,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      startDate: "",
      endDate: "",
    });
  };

  return (
    <motion.div
      key={medicine.id}
      variants={item}
      className=" rounded-lg shadow-md w-full bg-white "
    >
      <div className="bg-teal-600 p-3 text-white flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{medicine.name}</h3>
          <p className="text-teal-100 text-sm">{medicine.dosage}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleEditClick}
            className="p-2 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 cursor-pointer"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteMedicine(medicine._id)}
            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <p className="text-gray-700 font-medium">Schedule:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {medicine?.times?.map((time, index) => (
              <span
                key={index}
                className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs"
              >
                {time}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-700 font-medium">Instructions:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {medicine?.instructions?.map((instruction, index) => (
              <span
                key={index}
                className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs"
              >
                {instruction}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;
