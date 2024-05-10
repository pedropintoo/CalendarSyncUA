import { EventICSProps, useStructureContext } from '../contexts/StructureContext';

function CalendarEvent({event}: {event: EventICSProps}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName];
    return (
        <div 
        className={`bg-${color} text-white rounded`}>
            <h1>{event.title}</h1>
        </div>
    );
}

export default CalendarEvent;