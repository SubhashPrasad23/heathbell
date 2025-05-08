import React from "react";
import Input from "./Input";
import { motion, } from "framer-motion";


const PatientForm = ({ handleSave, formData, setFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div>
      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Patient Name"
          type="text"
          name="name"
          onChange={handleInputChange}
          value={formData.name}
          bgColor="bg-white"
          error={errors?.name}
        />

        <Input
          label="Age"
          type="number"
          name="age"
          onChange={handleInputChange}
          value={formData.age}
          bgColor="bg-white"
          error={errors?.age}

        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="bg-white w-full p-3 border border-gray-300 rounded-md focus:border-2  focus:border-teal-500 focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {errors?.gender && <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >{errors?.gender}</motion.p>}
        </div>

        <Input
          label="Contact Number"
          type="tel"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}

          bgColor="bg-white"
          error={errors?.contact}
        />
        <button
          type="submit"
          className=" w-full px-6 py-3 cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
