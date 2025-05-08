import { motion, AnimatePresence } from "framer-motion";
import { Pill, Calendar } from "lucide-react";

const MedicineForm = ({
  handleSubmit,
  handleInputChange,
  isSubmitting,
  formData,
  setFormData,
  times,
  setTimes,
  selectedInstruction,
  setSelectedInstruction,
  selectedDays,
  setSelectedDays,
  errors
}) => {


  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };


  const toggleInstruction = (instruction) => {
    if (!formData.frequency) return;

    const frequencyLimits = {
      "Once a day": 1,
      "Twice a day": 2,
      "Three times a day": 3,
      "Weekly": 1,
    };

    const limit = frequencyLimits[formData.frequency] || 1;
    if (selectedInstruction.includes(instruction)) {
      setSelectedInstruction(selectedInstruction.filter((d) => d !== instruction));
    } else {
      if (selectedInstruction.length < limit) {
        setSelectedInstruction([...selectedInstruction, instruction]);
      } else {

        alert(`You can only select ${limit} instruction(s) for this frequency.`);
      }
    }
  };


  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let count = 0;
    if (value === "Once a day") count = 1;
    else if (value === "Twice a day") count = 2;
    else if (value === "Three times a day") count = 3;
    else if (value === "Weekly") count = 1;

    setTimes(Array(count).fill(""));
  };

  const handleTimeChange = (index, value) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
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
    <form
      onSubmit={handleSubmit}
      className="h-full space-y-5 flex-1 overflow-auto hideScrollbar"
    >
      <div className="">
        <label className="block  font-medium mb-2">Medicine Name*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500"
          placeholder="Enter medicine name"
        />


        {errors?.name && <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-1"
        >{errors?.name}</motion.p>}
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="">
          <label className="block  font-medium mb-2 ">Type of Medicine</label>
          <select
            className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500"
            value={formData.typeofMedicine}
            onChange={handleSelectChange}
            name="typeofMedicine"
          >
            <option value="" disabled>
              Type of Medicine
            </option>
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Cream">Cream</option>
            <option value="Gel">Gel</option>
            <option value="Powder">Powder</option>
            <option value="Drops">Drops</option>
            <option value="Inhaler">Inhaler</option>

          </select>

        </div>

        <div className="">
          <label className="block font-medium mb-2">Dosage*</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            placeholder="e.g., 2 tablets, 5ml"
            className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500"

          />
          {errors?.dosage && <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >{errors?.dosage}</motion.p>}
        </div>
      </div>

      <div className="">
        <label className="block  font-medium mb-2 ">Frequency*</label>
        <select
          className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500"
          value={formData.frequency}
          onChange={handleSelectChange}
          name="frequency"
        >
          <option value="" disabled>
            Select frequency
          </option>
          <option value="Once a day">Once a day</option>
          <option value="Twice a day">Twice a day</option>
          <option value="Three times a day">Three times a day</option>
          <option value="Weekly">Once a week</option>
        </select>
        {errors?.frequency && <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-1"
        >{errors?.frequency}</motion.p>}
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
                <div key={index} className="relative w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Select Time*
                  </label>
                  <input
                    type="time"
                    step={60}
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="bg-white appearance-none w-full p-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-2 focus:border-teal-500 text-gray-700"
                  />
                </div>
              ))}
            </div>
            {errors?.times && <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-1"
            >{errors?.times}</motion.p>}
          </motion.div>
        )}

      </AnimatePresence>

      <div className="">
        <label className="block font-medium mb-2 ">Instructions*</label>
        <div className="grid grid-cols-2 gap-1">
          {instructionOptions.map((instruction, index) => (
            <div
              key={instruction}

              onClick={() => toggleInstruction(instruction)}
              className={`cursor-pointer text-center rounded-md md:py-2 py-1.5 px-1 transition-all ${selectedInstruction.includes(instruction)
                ? "bg-teal-500 text-white font-sm shadow-md"
                : "bg-white border border-gray-300  hover:border-teal-500"
                }`}
            >
              {instruction}
            </div>
          ))}
        </div>
        {errors?.selectedInstruction && <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-1"
        >{errors?.selectedInstruction}</motion.p>}
      </div>

      <div className="">
        <label className="block  font-medium mb-3 ">Days of Week*</label>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              onClick={() => toggleDay(day)}
              className={`cursor-pointer text-center rounded-md md:py-2 py-1.5 px-1 transition-all ${selectedDays.includes(day)
                ? "bg-teal-500 text-white font-sm shadow-md"
                : "bg-white border border-gray-300  hover:border-teal-500"
                }`}
            >
              {day.substring(0, 3)}
            </div>
          ))}
        </div>
        {errors?.selectedDays && <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-1"
        >{errors?.selectedDays}</motion.p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
          <label className=" text-cyan-800 font-medium mb-2 flex items-center">
            <Calendar size={18} className="mr-2" />
            Start Date*
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            min={new Date().toISOString().split("T")[0]}

          />
          {errors?.startDate && <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >{errors?.startDate}</motion.p>}
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
          <label className=" text-cyan-800 font-medium mb-2 flex items-center">
            <Calendar size={18} className="mr-2" />
            End Date*
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="bg-white w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            min={formData.startDate}
          />
          {errors?.endDate && <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >{errors?.endDate}</motion.p>}
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
  );
};

export default MedicineForm;
