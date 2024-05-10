import { EventICSProps, useStructureContext } from '../contexts/StructureContext';

function CalendarEvent({event, isStartDate}: {event: EventICSProps, isStartDate: boolean}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName];

    return (
        <div className="relative my-1 rounded cursor-pointer" style={{ border: `2px solid ${color}` }}>
            {/* Left color bar */}
            <div className={`${isStartDate ? 'absolute w-2 rounded-tl-none rounded-bl-none h-full left-0 top-0' : ''}`} style={{backgroundColor: color}}></div>
            {/* Event content with padding only on the right and top/bottom to leave space for the color bar */}
            <div className="p-0 pl-3 overflow-x-auto whitespace-nowrap">
                <span>{isStartDate ? `${event.startDate.getHours()}:${event.startDate.toLocaleTimeString('en', {minute: '2-digit'})}` : ''} 
                <span style={{color: `${color}`}}> {event.title}</span></span>
            </div>
        </div>
    );
}

export default CalendarEvent;