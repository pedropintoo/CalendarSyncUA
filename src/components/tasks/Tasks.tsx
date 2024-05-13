import TaskEvent  from './TaskEvent'; 
import { useStructureContext } from '../contexts/StructureContext';

function Tasks() {
    const SC = useStructureContext();

    return (
        <>
            <div className="border-solid h-full overflow-y-auto bg-slate-200 border-2 border-sky-600 rounded">
                <div className="py-5 px-5 flex justify-center border-solid border-b-2 border-sky-600">
                    <h1 className="">Tasks</h1>
                </div>
                <div>
                    {/* Aqui você pode mapear os eventos filtrados e renderizar a informação desejada */}
                    {SC.filteredEventsICS.map((event) => (
                        <TaskEvent isActive={true} key={event.id}event={event} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tasks;
