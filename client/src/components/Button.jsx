import React from "react";

const Button = ({ name, onClick, rounded }) => {
  return (
    
    <button
      type="submit"
      onClick={onClick}
      className={`w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold  transition duration-300 cursor-pointer ${rounded ? "rounded-full" :"rounded-md"}`}
    >
      {name}
    </button>
  );
};

export default Button;
