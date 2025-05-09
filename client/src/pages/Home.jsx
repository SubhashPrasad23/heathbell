import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, ArrowLeft } from "lucide-react";
import axios from "axios";
import { addMedicine, updateMedicine } from "../features/medicine/medicine";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import MedicineCard from "../components/MedicineCard";
import { addPatient } from "../features/patient/patientSlice";
import MedicineForm from "../components/MedicineForm";
import SuccessPopup from "../components/SuccessPopup";
import NoFound from "../components/NoFound";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const userId = useSelector((store) => store?.user?._id);
  const medicines = useSelector((store) => store.medicine);
  const patients = useSelector((store) => store?.patient);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState({});
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
  const [editingMedicine, setEditingMedicine] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    times: "",
    selectedDays: "",
    selectedInstruction: ""
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      times: "",
      selectedDays: "",
      selectedInstruction: ""
    };

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.dosage) {
      newErrors.dosage = "Dosage is required";
      isValid = false;
    }

    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    if (!times || times.length === 0 || times.some(t => !t)) {
      newErrors.times = "Time is required";
      isValid = false;
    }

    if (!selectedDays || selectedDays.length === 0) {
      newErrors.selectedDays = "Select at least one day";
      isValid = false;
    }

    if (!selectedInstruction || selectedInstruction.length === 0) {
      newErrors.selectedInstruction = "Instruction is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePatientChange = (selectedPatient) => {
    localStorage.setItem("selectedPatientId", selectedPatient._id);
    setIsPatientDialogOpen(false);
    setSelectedPatientId(selectedPatient?._id);
    setSelectedPatient(selectedPatient);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/${userId}/getAllPatient`,
          {
            withCredentials: true,
          }
        );

        const patientsData = response?.data?.data;
        dispatch(addPatient(patientsData));

        let savedId = localStorage.getItem("selectedPatientId");

        if (!savedId || !patientsData.some((p) => p._id === savedId)) {
          savedId = patientsData[0]?._id;
          localStorage.setItem("selectedPatientId", savedId);
        }

        const selected = patientsData.find((p) => p._id === savedId);
        setSelectedPatientId(savedId);
        setSelectedPatient(selected);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [userId]);

  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchAllMedicine = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL
          }/medicine/${selectedPatientId}/getAllMedicine`,
          { withCredentials: true }
        );
        dispatch(addMedicine(response?.data?.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMedicine();
  }, [selectedPatientId]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const response = axios.post(
        `${import.meta.env.VITE_BASE_URL}/medicine/${selectedPatientId}/${editingMedicine?._id
        }/editMedicine`,
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
      dispatch(updateMedicine({
        id: editingMedicine?._id,
        updatedData: {
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
      })
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
    <div className="w-full h-full flex flex-col flex-1 gap-5  ">
      {isEditing ? (
        <div className="flex items-center gap-2 ">
          <div
            onClick={() => setIsEditing(false)}
            className="p-2 mr-3 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 cursor-pointer"
          >
            <ArrowLeft />
          </div>
          <h4 className="text-xl font-semibold text-teal-700">
            Update your medicine
          </h4>
        </div>
      ) : (
        patients.length > 0 && (
          <motion.div
            className=" py-2 px-5 shadow-[0px_3px_0px_5px_teal] rounded-lg "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-start font-MontSerrat">
              <div>
                <h3 className="font-bold uppercase">{selectedPatient?.name}</h3>
                {selectedPatient?.age&&<p className="text-sm text-gray-500">
                  {selectedPatient?.age} years • {selectedPatient?.gender||""}
                </p>}
              </div>
              <button
                onClick={() => setIsPatientDialogOpen(true)}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer"
              >
                Change
              </button>
            </div>
          </motion.div>
        )
      )}

      {isPatientDialogOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-inner shadow-gray-300 max-w-md w-full border border-gray-200"
          >
            <div className="p-4 border-b border-teal-600">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-teal-700">
                  Select Patient
                </h3>
                <button
                  onClick={() => setIsPatientDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-auto ">
              {patients.map((patient) => (
                <motion.button
                  key={patient._id}
                  onClick={() => handlePatientChange(patient)}
                  className={`flex items-center p-3 rounded-lg transition-all w-full cursor-pointer ${patient._id == selectedPatientId
                    ? "bg-teal-600 shadow-inner shadow-teal-500 text-white"
                    : "hover:bg-gray-200 border border-transparent"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="ml-3 text-left">
                    <p className="font-medium ">{patient.name}</p>
                    <p
                      className={`${patient._id == selectedPatientId
                        ? " text-white"
                        : "text-gray-500"
                        } text-xs `}
                    >
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>

                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {isEditing ? (
        <div className="w-full flex-1 overflow-auto ">
          <MedicineForm
            handleSubmit={handleSave}
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
                transition={{ duration: 0.4 }} // 0.5 seconds
                className="fixed inset-0  flex items-center justify-center  p-4 z-50"
              >
                <SuccessPopup message="updated medicine" onClose={() => {
                  setShowSuccess(false)
                  setIsEditing(false)
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5 w-full flex-1 overflow-auto hideScrollbar"
        >
          {loading ? (
            <Loading />
          ) : medicines.length > 0 ? (
            medicines.map((medicine) => (
              <div key={medicine._id}>
                <MedicineCard
                  medicine={medicine}
                  setIsEditing={setIsEditing}
                  setEditingMedicine={setEditingMedicine}
                  setFormData={setFormData}
                />
              </div>
            ))
          ) : (

            <NoFound buttonText="Add Medicine" message="No Medicines Added" description="No medicines are currently scheduled. Add a medicine to start tracking reminders." onClose={() => navigate("add_medicine")} />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
