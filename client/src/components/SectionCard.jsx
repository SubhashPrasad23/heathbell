import React from "react";

const SectionCard = ({ title, children }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-lg text-teal-600">{title}</h4>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SectionCard;
