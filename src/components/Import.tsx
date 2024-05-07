import React from "react";

const ImportModal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default ImportModal;