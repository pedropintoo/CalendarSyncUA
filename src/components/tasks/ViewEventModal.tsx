import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import React, { useRef, useEffect, useState } from 'react';
import Button from "../calendar/Button";

const ViewEventModal = ({thisEvent, setIsOpen, clickCoordinates, openEdit}: {thisEvent: EventICSProps, setIsOpen : React.Dispatch<React.SetStateAction<boolean>>, openEdit: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const SC = useStructureContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const closeModal = () => {
        SC.setViewEventOpen(false);
        setIsOpen(false);
    }

    const handleEditEvent = () =>{
        SC.setEditEventOpen(true); 
        SC.setViewEventOpen(false);  
        openEdit(true); 
    }

    const handleConfirm = () => {  
        console.log("confirm");
        setConfirmOpen(true);
        console.log(isConfirmOpen);
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
        <>
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
                        <button className="text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-red-600 hover:bg-red-500" onClick={(e) => {e.stopPropagation(); handleConfirm();}}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {isConfirmOpen && 
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-20 z-50 ">
                    <div className="relative p-8 w-full  max-w-2xl max-h-full">
                        <div className="relative bg-white items-center justify-between p-4 md:p-5 rounded shadow-lg">
                            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center justify-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this event?</h3>
                                <button type="button" className="text-white bg-red-600 font-bold hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  inline-flex items-center px-5 py-2.5 text-center">
                                    Yes, I'm sure
                                </button>
                                <button type="button" className="py-2.5 px-5 ms-3 font-bold text-white focus:outline-none bg-gray-400 rounded-lg border border-gray-200 hover:bg-gray-500 focus:ring-4 focus:ring-gray-400 ">No, cancel</button>
                            </div>
                        </div>
                    </div>
                </div>    
            }
        </>
    )
};

export default ViewEventModal;