import { EventICSProps, useStructureContext } from "../contexts/StructureContext";

function TaskEvent({handleEvent, event}: {handleEvent: () => void,  event: EventICSProps}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName];
    var options = {day: 'numeric', month: 'long', year: 'numeric'}

    return (
        <div className="relative mx-2 my-3 py-1 rounded cursor-pointer" style={{ border: `2px solid ${color}` }}>
            {/* Left color bar */}
            <div className="absolute w-2 rounded-tl-none rounded-bl-none h-full left-0 top-0" style={{backgroundColor: color}}></div>
            {/* Event content with padding only on the right and top/bottom to leave space for the color bar */}
            <div className="p-0 pl-3 overflow-x-auto whitespace-nowrap">
                <span style={{color: `${color}`}}>{event.title}</span>
            </div>
            <div className="p-0 pl-3 overflow-x-auto whitespace-nowrap">
                
                <span>{event.startDate.toLocaleDateString("eng", options)} - {event.endDate.toLocaleDateString("eng", options)}</span>
            </div>
        </div>
    );
}

export default TaskEvent;