import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import axios from "axios";
import { addMedicine } from "../features/medicine/medicine";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import MedicineCard from "../components/MedicineCard";
import { addPatient } from "../features/patient/patientSlice";

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

  const navigate = useNavigate();
  console.log(selectedPatientId, "selectedPatientId");

  const handlePatientChange = (selectedPatient) => {
    localStorage.setItem("selectedPatientId", selectedPatient._id);
    // onPatientChange(selectedPatient);
    setIsPatientDialogOpen(false);
    setSelectedPatientId(selectedPatient._id);
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
    const fetchAllMedicine = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/medicine/${selectedPatientId}/getAllMedicine`,
          { withCredentials: true }
        );
        dispatch(addMedicine(response?.data?.data));
        console.log(response?.data?.data);
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

  return (
    <div className="w-full h-full flex flex-col flex-1 gap-5  ">
      {patients.length > 0 && (
        <motion.div
          className="  bg-white py-2 px-5 shadow-[0px_3px_0px_5px_teal] rounded-lg "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start ">
            <div>
              <h3 className="font-bold  uppercase">{selectedPatient.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedPatient.age} years • {selectedPatient.gender}
              </p>
            </div>
            <button
              onClick={() => setIsPatientDialogOpen(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer "
            >
              Change
            </button>
          </div>
        </motion.div>
      )}

      {isPatientDialogOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full "
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
                  className={`flex items-center p-3 rounded-lg transition-all w-full cursor-pointer ${
                    patient._id == selectedPatientId
                      ? "bg-teal-600 shadow-inner shadow-teal-500 text-white"
                      : "hover:bg-gray-200 border border-transparent"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="ml-3 text-left">
                    <p className="font-medium ">{patient.name}</p>
                    <p
                      className={`${
                        patient._id == selectedPatientId
                          ? " text-white"
                          : "text-gray-500"
                      } text-xs `}
                    >
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>
                  {/* {p.id === patient?.id && (
                    <CheckCircle className="ml-auto h-5 w-5 text-emerald-500" />
                  )} */}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      {isEditing ? (
        <div>fg</div>
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
                <MedicineCard medicine={medicine} setIsEditing={setIsEditing} />
              </div>
            ))
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex h-full flex-1 items-center justify-center "
            >
              <motion.div
                variants={item}
                className="p-6 max-w-md w-full text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <Pill className="h-10 w-10 text-amber-500" />
                  </div>
                </div>

                <p className="text-gray-600 text-xl font-bold">
                  No medicines have been added yet.
                </p>

                <p className="text-sm text-gray-600">
                  Set up medication schedules to get timely reminders.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("add_medicine")}
                  className="mt-5 w-full py-3 px-4 bg-teal-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Add Medicine
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
