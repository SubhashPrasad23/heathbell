import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addPatient, updatePatient } from "../features/patient/patientSlice";
import Loading from "./Loading";
import PatientCard from "./PatientCard";
import PatientForm from "./PatientForm";
import NoFound from "./NoFound";
import { useNavigate } from "react-router-dom";

const PatientsList = ({ setActiveView }) => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((store) => store.user?._id);
  const patients = useSelector((store) => store.patient);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const editSlideIn = {
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

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/${userId}/getAllPatient`,
          {
            withCredentials: true,
          }
        );
        dispatch(addPatient(response?.data?.data));
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
    // const storedId = localStorage.getItem("selectedPatientId");
    // setSelectedPatientId(storedId);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/${userId}/${
          editingPatient._id
        }/editPatient`,
        formData,
        { withCredentials: true }
      );

      dispatch(
        updatePatient({
          id: editingPatient._id,
          updatedData: formData,
        })
      );
      setIsEditing(false);
      setFormData("");
    } catch (error) {
      console.log(error);
    }
  };

  const backHandler = () => {
    if (isEditing) {
      setIsEditing(false);
      setFormData("");
    } else {
      navigate("/account");
    }
  };

  return (
    <div className=" w-full h-full flex flex-col gap-5 flex-1 overflow-hidden hideScrollbar">
      <div className=" flex items-center ">
        <button
          onClick={backHandler}
          className="p-2 mr-3 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 cursor-pointer "
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-teal-700">
          {isEditing ? "Edit Patient" : "All Patients"}
        </h2>
      </div>

      <div className="h-full overflow-auto hideScrollbar">
          {!isEditing ? (
            <motion.div
              key="patientList"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideIn}
              className="h-full flex flex-col overflow-auto hideScrollbar"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="h-full space-y-2 "
              >
                {loading ? (
                  <Loading />
                ) : patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <div key={patient._id}>
                      <PatientCard
                        patient={patient}
                        setFormData={setFormData}
                        setEditingPatient={setEditingPatient}
                        setIsEditing={setIsEditing}
                      />
                    </div>
                  ))
                ) : (
                  <NoFound setActiveView={setActiveView} />
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="editForm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={editSlideIn}
              className=" h-full flex flex-col "
            >
              <div className="">
                <PatientForm
                  handleSave={handleSave}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default PatientsList;
