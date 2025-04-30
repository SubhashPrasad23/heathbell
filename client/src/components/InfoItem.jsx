import React from "react";

const InfoItem = ({ title,content,isWarning }) => {
  return (
    <div className="mb-2">
      <h3 className={`font-semibold  ${isWarning?"text-red-600 animate-pulse":""}`}>{title}</h3>
      <p className="tracking-wide">{content || "Not available"}</p>
    </div>
  );
};

export default InfoItem;
