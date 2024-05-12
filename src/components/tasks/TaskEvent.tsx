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

    function handleViewEvent (e: React.MouseEvent<HTMLDivElement>) {
        setIsViewOpenLocal(!isViewOpenLocal);
        SC.setViewEventOpen(true);
        setClickCoordinates({ x: e.clientX, y: e.clientY });
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
                {isActive && SC.isViewEventOpen && isViewOpenLocal && <ViewEventModal thisEvent={event} setIsOpen={setIsViewOpenLocal} openEdit={setIsEditOpenLocal} clickCoordinates={clickCoordinates}/>}
            </div>
            {SC.isEditEventOpen && isEditOpenLocal && <EditEventModal thisEvent={event} setIsOpen={setIsEditOpenLocal} setIsView={setIsViewOpenLocal}/>}
        </>
    );
}

export default TaskEvent;