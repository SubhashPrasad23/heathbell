import React from "react";

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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="button"
          className={`absolute inset-y-0 right-0 flex items-center pr-3  text-lg  `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {icon}
        </button>
      </div>
    </div>
  );
};

export default Input;
