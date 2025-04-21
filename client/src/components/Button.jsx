import React from "react";

const Button = ({ name,onClick }) => {
  return (
    
    <button
      type="submit"
      onClick={onClick}
      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition duration-300 cursor-pointer"
    >
      {name}
    </button>
  );
};

export default Button;
