import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Calendar } from "lucide-react";
import axios from "axios";
import SuccessPopup from "../components/SuccessPopup";

const AddMedicine = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedId = localStorage.getItem("selectedPatientId");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFrequencyChange = (e) => {
    const selected = e.target.value;
    setFormData({
      ...formData,
      frequency: selected,
    });

    let count = 0;
    if (selected === "Once a day") count = 1;
    else if (selected === "Twice a day") count = 2;
    else if (selected === "Three times a day") count = 3;
    else if (selected === "Weekly") count = 1;

    setTimes(Array(count).fill(""));
  };

  const handleTimeChange = (index, value) => {
    console.log(value);
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  // const handleRemoveTime = (index) => {
  //   const updated = [...times];
  //   updated.splice(index, 1);
  //   setTimes(updated);
  // };

  // const handleAddTime = () => {
  //   setTimes([...times, "12:00"]);
  // };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  const toggleInstruction = (instruction) => {
    if (selectedInstruction.includes(instruction)) {
      setSelectedInstruction(
        selectedInstruction.filter((d) => d !== instruction)
      );
    } else {
      setSelectedInstruction([...selectedInstruction, instruction]);
    }
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
      console.log(response);
      setFormData({
        name: "",
        typeofMedicine: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
      });
      setSelectedInstruction([])
      setSelectedDays([])
      setTimes([])
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }

    // setTimeout(() => {

    //   setTimeout(() => {
    //     setShowSuccess(false);
    //   }, 3000);
    // }, 1500);
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const instructionOptions = [
    "Before breakfast",
    "After breakfast",
    "Before lunch",
    "After lunch",
    "Before dinner",
    "After dinner",
    "Before bed",
  ];

  return (
    <div className=" w-full h-full flex flex-col flex-1 ">
     
        <h2 className="text-2xl font-bold text-teal-700 mb-5 flex items-center">
          <Pill className="mr-2 text-teal-600" size={24} />
          Add Medicine
        </h2>

        <form onSubmit={handleSubmit} className="h-full space-y-5 flex-1 overflow-auto hideScrollbar">
          <div className="">
            <label className="block  font-medium mb-2">Medicine Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter medicine name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="  ">
              <label className="block  font-medium mb-2">
                Type of Medicine*
              </label>
              <input
                type="text"
                name="typeofMedicine"
                value={formData.typeofMedicine}
                onChange={handleInputChange}
                placeholder="e.g., Tablet, Syrup"
                className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="">
              <label className="block font-medium mb-2">Dosage*</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="e.g., 2 tablets, 5ml"
                className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="">
            <label className="block  font-medium mb-2 ">Frequency*</label>
            <select
              className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.frequency}
              onChange={handleFrequencyChange}
              name="frequency"
              required
            >
              <option value="" disabled>
                Select frequency
              </option>
              <option value="Once a day">Once a day</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Three times a day">Three times a day</option>
              <option value="Weekly">Once a week</option>
            </select>
          </div>

          <AnimatePresence>
            {times.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className=""
              >
                <div className="space-y-3 ">
                  {times.map((time, index) => (
                    <div className="relative w-full">
                      <label className="block text-gray-700 font-medium mb-1">
                        Select Time
                      </label>
                      <input
                        type="time"
                        step={60}
                        value={time}
                        onChange={(e) =>
                          handleTimeChange(index, e.target.value)
                        }
                        className="bg-white appearance-none w-full p-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="">
            <label className="block font-medium mb-2 ">Instructions</label>
            <div className="grid grid-cols-2 gap-1">
              {instructionOptions.map((instruction, index) => (
                <div
                  key={instruction}
                  onClick={() => toggleInstruction(instruction)}
                  className={`cursor-pointer text-center rounded-md md:py-2 py-1.5 px-1 transition-all ${
                    selectedInstruction.includes(instruction)
                      ? "bg-teal-500 text-white font-sm shadow-md"
                      : "bg-white border border-gray-300  hover:border-teal-500"
                  }`}
                >
                  {instruction}
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <label className="block  font-medium mb-3 ">Days of Week</label>
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`cursor-pointer text-center rounded-md md:py-2 py-1.5 px-1 transition-all ${
                    selectedDays.includes(day)
                      ? "bg-teal-500 text-white font-sm shadow-md"
                      : "bg-white border border-gray-300  hover:border-teal-500"
                  }`}
                >
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
              <label className="block text-cyan-800 font-medium mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                Start Date*
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
              <label className="block text-cyan-800 font-medium mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className=" w-full px-6 py-3 cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">Saving...</div>
              ) : (
                <>Save</>
              )}
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }} // 0.5 seconds
              className="fixed inset-0  flex items-center justify-center  p-4 z-50"
            >
              <SuccessPopup message="added medicine"/>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default AddMedicine;
