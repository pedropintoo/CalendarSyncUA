import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import { useEffect, useState } from "react";

const ViewEventModal = ({thisEvent, setIsOpen, clickCoordinates}: {thisEvent: EventICSProps, setIsOpen : React.Dispatch<React.SetStateAction<boolean>>}) => {
    const SC = useStructureContext();

    const closeModal = () => {
        SC.setViewEventOpen(false);
        setIsOpen(false);
    }

    return (
        <div className="fixed z-50 left-0" style={{ top: clickCoordinates.y, left: clickCoordinates.x}}>
            <div className="relative p-8 w-full max-w-2xl max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg">
                        {thisEvent.title}
                      </h3>
                      <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={(e) => {e.stopPropagation(); closeModal();}}>
                          <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                </div>
            </div>
        </div>
    )
};

export default ViewEventModal;