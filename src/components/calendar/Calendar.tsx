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
    "", "January", "February", "March", "April", "May", "June",
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

const Day = ({ day, currentDate, isToday, events }: { day: number, currentDate: Date, isToday: boolean }) => {
    const handleDayClick = () => {
        console.log('Day clicked:', currentDate.toDateString());
    }

    return (
        <>
            <div
                className={`relative px-3 py-2 cursor-pointer h-20 ${isToday ? 'bg-white' : 'bg-gray-50 text-gray-500'}`}
                onClick={handleDayClick}
            >
                <time dateTime={currentDate.toISOString()}>{day}</time>
                <div>
                    {events.map((event, index) => (
                        <Event handleEvent={() => { console.log("Event") }} color={event.tagColor} name={event.title} />
                    ))}
                </div>
            </div>
        </>
    );
}

// DONE
function CalendarHeader() {
    const CC = useCalendarContext()

    const handleNextMonth = () => {
        if (CC.currentMonth === 12) {
            CC.setMonth(1);
            CC.setYear(CC.currentYear + 1);
        } else {
            CC.setMonth(CC.currentMonth + 1);
        }
    }
    const handlePrevMonth = () => {
        if (CC.currentMonth === 1) {
            CC.setMonth(12);
            CC.setYear(CC.currentYear - 1);
        } else {
            CC.setMonth(CC.currentMonth - 1);
        }
    }

    console.log("Current Date: ", CC.currentMonth, CC.currentYear)

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
                    <button type="button" className="font-semibold ">{Months[CC.currentMonth]}</button>
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

function CalendarGrid() {
    const CC = useCalendarContext();
    const SC = useStructureContext();

    const daysInMonth = new Date(CC.currentYear, CC.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(CC.currentYear, CC.currentMonth, 1).getDay();

    const calendarGrid: JSX.Element[] = [];

    // Generate empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth - 1; i++) {
        calendarGrid.push(
            <div key={`empty-${i}`} className="relative bg-slate-200 px-3 py-2 text-gray-500 h-20"></div>
        );
    }

    // Generate cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(CC.currentYear, CC.currentMonth, day);
        const isToday = currentDate.toDateString() === new Date().toDateString();

        // Filter events for the current day
        const eventsForCurrentDay = SC.filteredEventsICS.filter(event => {
            const eventDate = event.startDate;
            return eventDate.toDateString() === currentDate.toDateString();
        });

        calendarGrid.push(
            <Day key={`day-${day}`} day={day} currentDate={currentDate} isToday={isToday} events={eventsForCurrentDay} />
        );
    }

    return (
        <div className="hidden lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
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

    const [currentMonth, setcurrentMonth] = useState(CC.currentMonth);
    const [currentYear, setCurrentYear] = useState(CC.currentYear);
    
    const setMonth = (monthIndex: number) => {
        setcurrentMonth(monthIndex);
    }
    const setYear = (year: number) => {
        setCurrentYear(year);
    }

    return (
        <>
        <div className="border-solid bg-slate-200 lg:col-span-4 rounded-lg border-2 border-sky-600 rounded">
            <CalendarContext.Provider value={{currentMonth, currentYear, setMonth, setYear}}>
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