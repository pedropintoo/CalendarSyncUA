import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import EditEventModal from './EditEventModal'
import React, { useState } from 'react';

function TaskEvent({handleEvent, event}: {handleEvent: () => void,  event: EventICSProps}){
    const SC = useStructureContext();

    const color = SC.tags[event.tagName];
    var options = {day: 'numeric', month: 'long', year: 'numeric'}
    const isOneDay = event.startDate.getDate() === event.endDate.getDate() && event.startDate.getMonth() === event.endDate.getMonth() && event.startDate.getFullYear() === event.endDate.getFullYear();

    const [isEditOpen, setEditOpen] = useState(false);
    const openEditModal = () => {
        setEditOpen(true);
    };
    const closeEditModal = () => {
        setEditOpen(false);
    };

    return (
        <div className="relative mx-2 my-4 px-1 py-1 rounded cursor-pointer overflow-x-auto whitespace-nowrap" style={{ border: `2px solid ${color}` }} onClick={openEditModal}>
            {/* Left color bar */}
            <div className="absolute w-2 rounded-tl-none rounded-bl-none h-full left-0 top-0" style={{backgroundColor: color}}></div>
            {/* Event content with padding only on the right and top/bottom to leave space for the color bar */}
            <div className="p-0 pl-3">
                <span style={{color: `${color}`}}>{event.title}</span>
            </div>
            <div className="p-0 pl-3">                
                <span>{event.startDate.toLocaleDateString("eng", options)} 
                    <span className={`${isOneDay ? 'hidden' : ''}`}>
                        - {event.endDate.toLocaleDateString("eng", options)}
                    </span>
                    

                </span>
            </div>
            {isEditOpen && <EditEventModal closeModal={closeEditModal} thisEvent={event}/>}
        </div>
    );
}

export default TaskEvent;