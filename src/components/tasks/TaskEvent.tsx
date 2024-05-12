import { colors, titleCase } from "../MainStructure";
import { useState } from "react";
import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import EditEventModal from './EditEventModal'
import ViewEventModal from "./ViewEventModal";

function TaskEvent({event , isActive}: {event: EventICSProps, isActive: boolean}){
    const SC = useStructureContext();
    
    let color = SC.tags[event.tagName] ? SC.tags[event.tagName] : colors[Math.floor(Math.random() * colors.length)];
    if (!isActive) color = '#4b5563';
    const options = {day: 'numeric', month: 'long', year: 'numeric'}
    const isOneDay = event.startDate.getDate() === event.endDate.getDate() && event.startDate.getMonth() === event.endDate.getMonth() && event.startDate.getFullYear() === event.endDate.getFullYear();

    const [isViewOpenLocal, setIsViewOpenLocal] = useState(false);
    const [isEditOpenLocal, setIsEditOpenLocal] = useState(false);
    const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 }); // State to store click coordinates
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    function handleViewEvent (e: React.MouseEvent<HTMLDivElement>) {
        setIsViewOpenLocal(!isViewOpenLocal);
        SC.setViewEventOpen(true);
        setClickCoordinates({ x: e.clientX, y: e.clientY });
    }

    const handleDeleteEvent = () => {
        console.log("delete");
        console.log("antes" + SC.allEventsICS);
        console.log("antes" + SC.filteredEventsICS);
        delete(SC.allEventsICS[SC.allEventsICS.indexOf(event)]);
        delete(SC.filteredEventsICS[SC.filteredEventsICS.indexOf(event)]);
        console.log("depois" + SC.allEventsICS);
        console.log("depois" + SC.filteredEventsICS);
        confirmClose();
    }

    const confirmClose = () => {
        setConfirmOpen(false);
        setIsViewOpenLocal(false);
    }

    return (
        <>
        <div className="relative mx-2 my-4 px-1 py-1 rounded cursor-pointer overflow-x-auto whitespace-nowrap" onClick={handleViewEvent}>
            {/* Left color bar */}
            <div className="absolute w-2 rounded-tl-none rounded-bl-none h-full left-0 top-0" style={{backgroundColor: color}}></div>
            {/* Event content with padding only on the right and top/bottom to leave space for the color bar */}
            <div className="p-0 pl-3">
                <span style={{color: `${color}`}}>{event.title} <br/>{titleCase(event.tagName.split('-')[1])}</span>
            </div>
            <div className="p-0 pl-3">                
                <span>
                    {event.startDate.toLocaleDateString("eng", options)} 
                    <span className={`${isOneDay ? 'hidden' : ''}`}>
                        - {event.endDate.toLocaleDateString("eng", options)}
                    </span>
                </span>
                </div>
                {isActive && SC.isViewEventOpen && isViewOpenLocal && <ViewEventModal thisEvent={event} setIsOpen={setIsViewOpenLocal} openEdit={setIsEditOpenLocal} clickCoordinates={clickCoordinates} setConfirm={setConfirmOpen}/>}
            </div>
            {SC.isEditEventOpen && isEditOpenLocal && <EditEventModal thisEvent={event} setIsOpen={setIsEditOpenLocal} setIsView={setIsViewOpenLocal}/>}
            {isConfirmOpen && 
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-20 z-50 ">
                    <div className="relative p-8 w-full  max-w-2xl max-h-full">
                        <div className="relative bg-white items-center justify-between p-4 md:p-5 rounded shadow-lg">
                            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={confirmClose}>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center justify-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this event?</h3>
                                <button type="button" className="text-white bg-red-600 font-bold hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  inline-flex items-center px-5 py-2.5 text-center" onClick={handleDeleteEvent}>
                                    Yes, I'm sure
                                </button>
                                <button type="button" className="py-2.5 px-5 ms-3 font-bold text-white focus:outline-none bg-gray-400 rounded-lg border border-gray-200 hover:bg-gray-500 focus:ring-4 focus:ring-gray-400 " onClick={confirmClose}>No, cancel</button>
                            </div>
                        </div>
                    </div>
                </div>    
            }
        </>
    );
}

export default TaskEvent;