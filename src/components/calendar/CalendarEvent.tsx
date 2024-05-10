import { EventICSProps, useStructureContext } from '../contexts/StructureContext';

function CalendarEvent({event}: {event: EventICSProps}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName];
    console.log(`bg-${color}`)
    return (
        <div 
        className={`text-white p-2 rounded-lg m-1 cursor-pointer`}
        style={{ backgroundColor: `${color}`}}>
            <h1>{event.title}</h1>
        </div>
    );
}

export default CalendarEvent;