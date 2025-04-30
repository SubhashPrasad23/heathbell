import React from "react";

const SectionCard = ({ title, children }) => {
  return (
    <div className="space-y-2 bg-white  rounded-lg  shadow-inner shadow-gray-300 ">
      <h4 className="font-semibold text-lg text-white uppercase bg-teal-600 rounded-t-lg py-2 px-4 shadow-inner shadow-teal-400 ">{title}</h4>
      <div className="px-4 py-2">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SectionCard;
