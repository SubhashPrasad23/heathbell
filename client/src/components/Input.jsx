import React from "react";
import { motion } from "framer-motion"

const Input = ({
  type,
  name,
  value,
  placeholder,
  label,
  onChange,
  setShowPassword,
  showPassword,
  icon,
  bgColor,
  error
}) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 10 }} 
          className={`${bgColor} w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500`}
        />
        {showPassword && <button
          type="button"
          className={`absolute inset-y-0 right-0 flex items-center pr-3  text-lg  `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {icon}
        </button>}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Input;
