import { colors } from "../MainStructure";
import { useState } from "react";
import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import EditEventModal from './EditEventModal'


function TaskEvent({event}: {event: EventICSProps}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName] ? SC.tags[event.tagName] : colors[Math.floor(Math.random() * colors.length)];
    const options = {day: 'numeric', month: 'long', year: 'numeric'}
    const isOneDay = event.startDate.getDate() === event.endDate.getDate() && event.startDate.getMonth() === event.endDate.getMonth() && event.startDate.getFullYear() === event.endDate.getFullYear();

    const [isOpen, setIsOpen] = useState(false);

    function handleEditEvent () {
        setIsOpen(true);
        console.log('Edit Event');
        console.log(SC.isEditEventOpen);
        SC.setEditEventOpen(true);
        console.log("AAA - - " + event.startDate);
        console.log(event.startDate.toISOString().split('T')[1].split('.000Z')[0]);
    }

    return (
        <div className="relative mx-2 my-4 px-1 py-1 rounded cursor-pointer overflow-x-auto whitespace-nowrap" style={{ border: `2px solid ${color}` }} onClick={handleEditEvent}>
            {/* Left color bar */}
            <div className="absolute w-2 rounded-tl-none rounded-bl-none h-full left-0 top-0" style={{backgroundColor: color}}></div>
            {/* Event content with padding only on the right and top/bottom to leave space for the color bar */}
            <div className="p-0 pl-3">
                <span style={{color: `${color}`}}>{event.title} <br/>{event.tagName.split('-')[1]}</span>
            </div>
            <div className="p-0 pl-3">                
                <span>{event.startDate.toLocaleDateString("eng", options)} 
                    <span className={`${isOneDay ? 'hidden' : ''}`}>
                        - {event.endDate.toLocaleDateString("eng", options)}
                    </span>
                </span>
            </div>
            {SC.isEditEventOpen && isOpen && <EditEventModal thisEvent={event} setIsOpen={setIsOpen}/>}
        </div>
    );
}

export default TaskEvent;