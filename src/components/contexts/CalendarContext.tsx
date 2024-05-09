import {createContext} from 'react';
import React from 'react';

export interface CalendarContextType {
    currentMonth: number;
    currentYear: number;
    setMonth: (monthIndex: number) => void;
    setYear: (year: number) => void;
}



export const CalendarContext = createContext<CalendarContextType>({
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    setMonth: () => {},
    setYear: () => {}
});

export const useCalendarContext = () => {
    if (React.useContext(CalendarContext) === undefined) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }
    return React.useContext(CalendarContext);
}