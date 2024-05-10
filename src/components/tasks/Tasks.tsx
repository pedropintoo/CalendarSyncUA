import TaskEvent  from './TaskEvent'; 
import { useStructureContext } from '../contexts/StructureContext';
import { useCalendarContext } from '../contexts/CalendarContext';

function Tasks() {
    const SC = useStructureContext();
    const CC = useCalendarContext();
    console.log(CC.currentMonthIndex)
    return (
        <>
            <div className="border-solid bg-slate-200 border-2 border-sky-600 rounded">
                <div className="py-5 px-5 flex justify-center border-solid border-b-2 border-sky-600">
                    <h1 className="">Tasks</h1>
                </div>
                <div className='relative cursor-pointer h-dvh overflow-y-auto'>
                    {/* Aqui você pode mapear os eventos filtrados e renderizar a informação desejada */}
                    {SC.filteredEventsICS.map((event) => (
                        <TaskEvent key={event.id} handleEvent={()=>{console.log("Event")}} event={event} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tasks;
