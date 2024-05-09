import React, { useState } from 'react';
import Event from './Event';
import Modal from './Import'
import { StructureContext, useStructureContext } from '../contexts/StructureContext';
import { CalendarContext, useCalendarContext } from '../contexts/CalendarContext';

interface ButtonProps {
    label: string;
    onClick?: () => void;
}

const Months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];



const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <button
            className={`text-white font-bold py-2 px-4 m-1 rounded ${isHovered ? 'bg-sky-500' : 'bg-sky-600'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const HeaderButtons: React.FC = () => {
    const [isImportOpen, setImportOpen] = useState(false);
    const handleAddEvent = () => {

        console.log('Add Event');
    };

    const handleExport = () => {
        console.log('Export');
    };
    const openImport = () => {
        setImportOpen(true);
    };
    const closeImport = () => {
        setImportOpen(false);
    };

    return (
        <>
            <div className="flex border-solid border-b-2 border-sky-600 justify-between items-center px-4 py-2">
                <div>
                    <Button label="Add Event +" onClick={handleAddEvent} />
                </div>
                <div>
                    <Button label="Import" onClick={openImport} />
                    <Modal isOpen={isImportOpen}>
                        <button type="button" className="ml-auto text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2.5 py-1 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={closeImport}>X</button>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:border-gray-500 dark:hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">ICS file only</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
                    </Modal>
                    <Button label="Export" onClick={handleExport} />
                </div>
            </div>
        </>
    );
}

// DONE
function CalendarHeader() {
    const CC = useCalendarContext()

    const handleNextMonth = () => {
        if (CC.currentMonthIndex === 11) {
            CC.setMonthIndex(0);
            CC.setYear(CC.currentYear + 1);
        } else {
            CC.setMonthIndex(CC.currentMonthIndex + 1);
        }
    }
    const handlePrevMonth = () => {
        if (CC.currentMonthIndex === 0) {
            CC.setMonthIndex(11);
            CC.setYear(CC.currentYear - 1);
        } else {
            CC.setMonthIndex(CC.currentMonthIndex - 1);
        }
    }

    console.log("Current Date: ", CC.currentMonthIndex, CC.currentYear)

    return (
        <>
        <div className='flex justify-center items-center'>
            <div className='w-80 items-center justify-center py-1'>
                <div className='text-center rounded-md bg-white shadow-sm grid grid-cols-4 gap-1 border-2 border-solid'>
                    <button onClick={handlePrevMonth} type="button" className="flex align-center justify-center py-2">
                        <span className="sr-only">Previous month</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button type="button" className="font-semibold ">{Months[CC.currentMonthIndex]}</button>
                    <button type="button" className="">{CC.currentYear}</button>
                    <button onClick={handleNextMonth} type="button" className="flex align-center justify-center py-2">
                        <span className="sr-only">Next month</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
            </div>
        </div>
        
        </>
    );
}

const Day = ({ date }: { date: Date }) => {
    
    const SC = useStructureContext();
    const CC = useCalendarContext();

    const handleDayClick = () => {
        console.log('Day clicked:', date.toDateString());
        console.log(isMonth)
    }

    const currentDayOfMonth = date.getDate();
    const isToday = date.toDateString() === new Date().toDateString();

    // Filter events that has: startEvent <= currentDate <= endEvent
    const events = SC.filteredEventsICS.filter(event => {
        return event.startDate.valueOf() <= date.valueOf() && date.valueOf() <= event.endDate.valueOf();
    });

    const isMonth = date.getMonth() == CC.currentMonthIndex;

    return (
        <>
            <div
                className={`relative px-3 py-2 cursor-pointer h-36 ${isToday ? 'border-2 border-gray-100' : ''} bg-white ${isMonth? '': 'bg-gray-100'}`}
                onClick={handleDayClick}
            >
                <p className={`${isToday ? 'flex items-center justify-center font-semibold border border-gray-300 rounded-full w-5 h-5' : ''}`}>{currentDayOfMonth}</p>
                <div>
                    {events.map((event, index) => (
                        <Event handleEvent={() => { console.log("Event") }} color={event.tagColor} name={event.title} />
                    ))}
                </div>
            </div>
        </>
    );
}

// Before reading take a look in Data Class from typescript documentation...
function CalendarGrid() {
    const CC = useCalendarContext();

    const calendarGrid: JSX.Element[] = [];

    const daysInMonth = new Date(CC.currentYear, CC.currentMonthIndex+1, 0).getDate(); // go to last day..
    
    // start week day of the month
    const firstDayOfMonth = new Date(CC.currentYear, CC.currentMonthIndex, 1).getDay();

    const currentMonth = new Date(CC.currentYear, CC.currentMonthIndex)
    const prevMonth = new Date(currentMonth.setMonth(currentMonth.getMonth()-1)); // decrease one month
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth()+1, 0).getDate();

    // Generate cells for days before the first day of the month
    for (let offset = firstDayOfMonth - 2; offset >= 0; offset--) {
        const currentDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - offset);
        calendarGrid.push(<Day date={currentDate} />);
    }

    // Generate cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(CC.currentYear, CC.currentMonthIndex, day);
        calendarGrid.push(<Day date={currentDate} />);
    }

    const nextMonth = new Date(currentMonth.setMonth(currentMonth.getMonth()+2)); // increase one month

    // Generate cells for days after the last day of the month
    for (let i = 1; calendarGrid.length % 7 != 0; i++) {
        const currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
        calendarGrid.push(<Day date={currentDate} />);
    }

    return (
        <div className="grid grid-cols-7 grid-rows-6 gap-px">
            {calendarGrid}
        </div>
    );

}


// DONE
function WeekDays() {
    // Array holding the full names of the week days, used to display full names for larger screens
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            {days.map(day => (
                <div key={day} className="flex justify-center bg-white py-2">
                    <span>{day[0]}</span>
                    <span className="sr-only sm:not-sr-only">{day.substring(1)}</span>
                </div>
            ))}
        </div>
    );
}


function Calendar() {
    // Calendar Context
    const CC = useCalendarContext();

    const [currentMonthIndex, setMonthIndex] = useState(CC.currentMonthIndex);
    const [currentYear, setYear] = useState(CC.currentYear);
    
    return (
        <>
        <div className="border-solid bg-slate-200 lg:col-span-4 rounded-lg border-2 border-sky-600">
            <CalendarContext.Provider value={{currentMonthIndex, currentYear, setMonthIndex, setYear}}>
                <HeaderButtons />
                <CalendarHeader/>
                <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
                    <WeekDays />
                    <CalendarGrid />
                </div>
            </CalendarContext.Provider>
        </div>
        </>
    );
}

export default Calendar;