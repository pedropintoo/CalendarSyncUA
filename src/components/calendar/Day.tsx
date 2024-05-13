import { useStructureContext } from '../contexts/StructureContext';
import { useCalendarContext } from '../contexts/CalendarContext';
import CalendarEvent from './CalendarEvent';
import { useState } from 'react';
import AddEventModal from './AddEventModal';

function Day ({ date } : { date: Date }) {
    
    const SC = useStructureContext();
    const CC = useCalendarContext();
    const [isAddEventOpenLocal, setAddEventOpenLocal] = useState(false);

    const handleDayClick = () => {
        console.log('Day clicked:', date.toDateString());
        console.log(isMonth);
        CC.setAddEventOpen(true);
        setAddEventOpenLocal(true);
    }

    const currentDayOfMonth = date.getDate();
    const isToday = date.toDateString() === new Date().toDateString();

    // Filter events that has: startEvent <= currentDate <= endEvent
    const events = SC.filteredEventsICS.filter(event => {
        const start = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate());
        const end = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());

        return start <= date && date <= end;
    });

    // Sort by hour
    events.sort((a, b) => a.startDate == b.startDate ? 0 : a.startDate < b.startDate ? -1 : 1);

    const isMonth = date.getMonth() == CC.currentMonthIndex;

    return (
        <>
            <div className={`group relative px-3 py-2 cursor-pointer h-36 overflow-y-auto ${isToday ? 'border-2 border-black-100' : ''}  ${isMonth? 'bg-white': 'bg-gray-100'} hover:bg-sky-50`}
                onClick={(e) => {e.stopPropagation(); handleDayClick();}}>
                <div className='grid grid-cols-4'>
                    <p className={`col-span-3 ${isToday ? 'flex items-center justify-center font-semibold border border-gray-300 rounded-full w-6 h-6' : ''}`}>{currentDayOfMonth}</p>
                    <p className={`hidden opacity-60 ms-2 mb-2 h-8 w-8 group-hover:block hover:opacity-100`} ><img src="https://static.thenounproject.com/png/1515272-200.png"></img></p>
                </div>
                <div>
                    {events.map((event) => (
                    <CalendarEvent 
                        key={event.id} 
                        event={event} 
                        isStartDate={event.startDate.getDate() == date.getDate()}/>
                        ))}
                </div>
            </div>
            {isAddEventOpenLocal && CC.isAddEventOpen &&<AddEventModal setAddEventOpen={setAddEventOpenLocal} day={date}/>}
        </>
    );
}

export default Day;