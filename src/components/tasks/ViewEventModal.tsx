import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import React, { useRef, useEffect } from 'react';
import Button from "../calendar/Button";

const ViewEventModal = ({thisEvent, setIsOpen, clickCoordinates, openEdit}: {thisEvent: EventICSProps, setIsOpen : React.Dispatch<React.SetStateAction<boolean>>, openEdit: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const SC = useStructureContext();
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = () => {
        SC.setViewEventOpen(false);
        setIsOpen(false);
    }

    const handleEditEvent = () =>{
        SC.setEditEventOpen(true); 
        SC.setViewEventOpen(false);  
        openEdit(true); 
    }

    useEffect(() => {
        // Add event listener when modal is opened
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                event.stopPropagation();
                SC.setViewEventOpen(false);
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Remove event listener when modal is closed
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef, SC, setIsOpen]);

    return (
        <div className="fixed z-50" style={{ top: clickCoordinates.y/2, left: clickCoordinates.x - 250}}>
            <div ref={modalRef} className="relative p-8 w-full max-w-2xl max-h-full bg-white p-8 rounded-lg shadow-lg">
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
                <div className="p-4 md:p-5">
                    <p className="text-sm text-gray-500">
                        {thisEvent.startDate.toISOString().split('T')[0]} | {thisEvent.endDate.toISOString().split('T')[0]}
                    </p>
                    <p className="text-sm text-gray-500">
                        {thisEvent.startDate.toISOString().split('T')[1].split(':00.000Z')[0]} - {thisEvent.endDate.toISOString().split('T')[1].split(':00.000Z')[0]}
                    </p>
                </div>
                <div className="flex justify-center mt-4 ">
                    <Button label="Edit" onClick={handleEditEvent}/>
                    <button className="text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-red-600 hover:bg-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ViewEventModal;