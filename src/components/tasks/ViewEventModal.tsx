import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import React, { useRef, useEffect } from 'react';
import Button from "../calendar/Button";

const ViewEventModal = ({ thisEvent, setIsOpen, clickCoordinates, openEdit, setConfirm }: { thisEvent: EventICSProps, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, openEdit: React.Dispatch<React.SetStateAction<boolean>>, setConfirm: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const SC = useStructureContext();
    const modalRef = useRef<HTMLDivElement>(null);

    // Convert the dates the correctly time-zone
    const offsetMinutesStart = thisEvent.startDate.getTimezoneOffset();
    const adjustedStartDate = new Date(thisEvent.startDate.getTime() - (offsetMinutesStart * 60000));
    const offsetMinutesEnd = thisEvent.endDate.getTimezoneOffset();
    const adjustedEndDate = new Date(thisEvent.endDate.getTime() - (offsetMinutesEnd * 60000));

    const closeModal = () => {
        SC.setViewEventOpen(false);
        setIsOpen(false);
    }

    const handleEditEvent = () => {
        SC.setEditEventOpen(true);
        closeModal();
        openEdit(true);
    }

    const handleConfirm = () => {
        console.log("confirm");
        setConfirm(true);
        closeModal();
    }

    useEffect(() => {
        // Add event listener when modal is opened
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !(modalRef.current.contains(event.target as Node))) {
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
            <div className="fixed z-50" style={{ top: clickCoordinates.y, left: clickCoordinates.x }}>
                <div ref={modalRef} className="relative p-6 w-full max-w-md h-full bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white overflow-x-auto">
                            {thisEvent.title}
                        </h3>
                        <button
                            type="button"
                            className="rounded-lg p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={(e) => { e.stopPropagation(); closeModal(); }}
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {thisEvent.description && (
                        <div className="mb-4 overflow-y-auto overflow-x-hidden" style={{ maxHeight: '100px' }}>
                            <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Description:</label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-normal">
                                {thisEvent.description}
                            </p>
                        </div>
                    )}
                    <div className='grid gap-4 mb-4 grid-cols-2 text-sm'>
                        <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-300'>Start Date:</h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {adjustedStartDate.toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-300'>End Date:</h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {adjustedEndDate.toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-300'>Start Time:</h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {adjustedStartDate.toLocaleTimeString()}
                            </p>
                        </div>
                        <div>
                            <h4 className='font-medium text-gray-700 dark:text-gray-300'>End Time:</h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {adjustedEndDate.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    <div className='mb-10'>
                        <h4 htmlFor='tag' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Tag:</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            {thisEvent.tagName}
                        </p>
                    </div>
                    <div className="flex justify-evenly mt-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" onClick={handleEditEvent}>
                            Edit
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                            onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
};

export default ViewEventModal;