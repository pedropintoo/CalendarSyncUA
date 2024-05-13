import React, { useState } from 'react';
import ImportModal from './ImportModal'
import AddEventModal from './AddEventModal';
import ExportModal from './ExportModal';
import { CalendarContext, useCalendarContext } from '../contexts/CalendarContext';
import Day from './Day';
import Button from './Button';
import { useStructureContext } from '../contexts/StructureContext';

const Months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


const HeaderButtons: React.FC = () => {

    const CC = useCalendarContext();
    const [isAddEventOpenLocal, setAddEventOpenLocal] = useState(false);

    const handleAddEvent = () => {
        console.log('Add Event');
        CC.setAddEventOpen(true);
        setAddEventOpenLocal(true);
    };

    const handleImport = () => {
        console.log('Import');
        CC.setImportOpen(true);
    };

    const handleExport = () => {
        console.log('Export');
        CC.setExportOpen(true);
    }

    const SC = useStructureContext()

    return (
        <>
            <div className="flex border-solid border-b-2 border-sky-600 justify-between items-center px-4 py-2">
                <div>
                    <Button label="Add Event +" onClick={handleAddEvent} />
                    {CC.isAddEventOpen && isAddEventOpenLocal &&
                        <AddEventModal setAddEventOpen={setAddEventOpenLocal} day={null}/>}
                </div>
                <div>
                <div className='grid grid-cols-2'>
                    <div className='w-full h-full'>
                        <div className='relative'>
                        <div className={`${CC.isImportOpen || SC.allEventsICS.length != 0 ? 'hidden' : ''} absolute top-0 left-0 -ml-1 -mt-1 w-4 h-4 rounded-full bg-sky-300 animate-ping`}></div>
                        <Button label="Import" onClick={handleImport} />
                        </div>
                    </div>
                        {CC.isImportOpen &&
                            <ImportModal />}
                        <Button label="Export" onClick={handleExport} />
                        {CC.isExportOpen &&
                            <ExportModal />}
                    </div>
                </div>    
                
            </div>
        </>
    );
}

// DONE
function CalendarHeader() {
    const CC = useCalendarContext();

    const handleMonthChange = (monthIndex: React.SetStateAction<number>) => {
        CC.setMonthIndex(monthIndex);
    };

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
                <div className='w-90 items-center justify-center py-1'>
                    <div className='text-center rounded-md bg-white grid grid-cols-6 gap-1 border-2 border-solid'>
                        <button onClick={handlePrevMonth} type="button" className="flex align-center justify-center py-2">
                            <span className="sr-only">Previous month</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                            <select value={Months[CC.currentMonthIndex]} onChange={(e) => handleMonthChange(Months.indexOf(e.target.value))} className="items-center text-center bg-white col-span-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 block w-full">
                                {Months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                            <select value={CC.currentYear} onChange={(e) => CC.setYear(parseInt(e.target.value))} className="items-center text-center bg-white col-span-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 block w-full">
                                {Array.from({ length: 10 }, (_, i) => CC.currentYear - 5 + i).map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
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

// Before reading take a look in Data Class from typescript documentation...
// DONE
function CalendarGrid() {
    const CC = useCalendarContext();

    let inserted = 0;
    const calendarGrid: JSX.Element[] = [];

    const daysInMonth = new Date(CC.currentYear, CC.currentMonthIndex + 1, 0).getDate(); // go to last day..

    // start week day of the month
    const firstDayOfMonth = new Date(CC.currentYear, CC.currentMonthIndex, 1).getDay();

    const currentMonth = new Date(CC.currentYear, CC.currentMonthIndex)
    const prevMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)); // decrease one month
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

    // Generate cells for days before the first day of the month
    for (let offset = firstDayOfMonth - 2; offset >= 0; offset--) {
        const currentDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - offset);
        calendarGrid.push(<Day key={inserted++} date={currentDate} />);
    }

    // Generate cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(CC.currentYear, CC.currentMonthIndex, day);
        calendarGrid.push(<Day key={inserted++} date={currentDate} />);
    }

    const nextMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + 2)); // increase one month

    // Generate cells for days after the last day of the month
    for (let i = 1; inserted % 7 != 0; i++) {
        const currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
        calendarGrid.push(<Day key={inserted++} date={currentDate} />);
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
    const [isAddEventOpen, setAddEventOpen] = useState(CC.isAddEventOpen)
    const [isImportOpen, setImportOpen] = useState(CC.isImportOpen)
    const [isExportOpen, setExportOpen] = useState(CC.isExportOpen)

    return (
        <>
            <div className="border-solid bg-slate-200 lg:col-span-4 h-full rounded-lg border-2 border-sky-600">
                <CalendarContext.Provider value={{ currentMonthIndex, currentYear, setMonthIndex, setYear, isAddEventOpen, setAddEventOpen, isImportOpen, setImportOpen, isExportOpen, setExportOpen }}>
                    <HeaderButtons />
                    <CalendarHeader />
                    <div className=" rign lg:flex lg:flex-auto lg:flex-col">
                        <WeekDays />
                        <CalendarGrid />
                    </div>
                </CalendarContext.Provider>
            </div>
        </>
    );
}

export default Calendar;