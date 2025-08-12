"use client";
import React, { useRef, useState } from "react";
import { useOutsideClick } from "@/hook/useOutsideClick";
    
const Dropdown = ({
  children,
  trigger,
  position = "right",
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  position?: "right" | "left" | "top" | "bottom" | "center";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false), [isOpen]);

  return (
    <div
      className="relative inline-block"
      onClick={() => setIsOpen(!isOpen)}
      ref={dropdownRef}
    >
      <div
        className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-blue-500 transition-all duration-300 ${
          isOpen ? "from-purple-600 to-blue-500" : ""
        }`}
      >
        {trigger}
      </div>

      {isOpen && (
        <div className={`absolute ${position === "right" ? "right-0" : position === "left" ? "left-0" : position === "top" ? "top-0" : position === "bottom" ? "bottom-0" : "left-1/2 -translate-x-1/2"} mt-2 w-56 bg-bg rounded-md shadow-lg p-2 z-10`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
