import { EventICSProps, useStructureContext } from "../contexts/StructureContext";

function Event({handleEvent, event}: {handleEvent: () => void,  event: EventICSProps}){
    const SC = useStructureContext();
    
    const color = SC.tags[event.tagName];

    return (
        <div 
        className={`bg-${color} text-white p-2 rounded-lg m-1 cursor-pointer`}
        onClick={handleEvent}>
            <h1>{event.title}</h1>
        </div>
    );
}

export default Event;