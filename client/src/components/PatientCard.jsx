import React from "react";
import { removePatient } from "../features/patient/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/helper/helper";

const PatientCard = ({
  patient,
  setFormData,
  setEditingPatient,
  setIsEditing,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.user?._id);
  const medicines = useSelector((store) => store.medicine);


  const handleEditClick = (patient) => {
    setIsEditing(true);
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
    });
  };

  const deleteHandler = async (patientId) => {

    if (medicines && medicines.length > 0) {
      alert("Cannot delete patient. Please make sure all medicines are removed before deleting the patient.");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/patient/${userId}/${patientId}/deletePatient`,
        {},
        { withCredentials: true }
      );

      dispatch(removePatient(patientId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-white shadow-inner border border-gray-300 shadow-gray-200 p-3 rounded-lg  `}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold tracking-wide">{capitalizeFirstLetter(patient.name)}</h4>
        <div className="space-x-1">
          <button
            className="p-2 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 cursor-pointer"
            onClick={() => handleEditClick(patient)}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
            onClick={() => deleteHandler(patient._id)}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        className={`
           text-gray-500
        `}
      >
        <span>{patient.age} years</span> | {patient.gender}
      </div>
    </div>
  );
};

export default PatientCard;
