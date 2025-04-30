"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Info } from "lucide-react";

const StackingCard = ({ title, children, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.8 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      style={{
        position: isInView ? "absolute" : "relative",
        top: isInView ? `${index * 40}px` : "auto", // stacking offset
        zIndex: isInView ? 100 - index : "auto",
        scale: isInView ? 1 - index * 0.03 : 1,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Info className="h-5 w-5 text-teal-500" />
          {title}
        </h3>
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
};

export default StackingCard;
