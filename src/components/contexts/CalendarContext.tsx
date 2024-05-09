import {createContext} from 'react';
import React from 'react';

export interface CalendarContextType {
    currentMonthIndex: number;
    currentYear: number;
    setMonthIndex: (monthIndex: React.SetStateAction<number>) => void;
    setYear: (year: React.SetStateAction<number>) => void;
}



export const CalendarContext = createContext<CalendarContextType>({
    currentMonthIndex: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    setMonthIndex: () => {},
    setYear: () => {}
});

export const useCalendarContext = () => {
    if (React.useContext(CalendarContext) === undefined) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }
    return React.useContext(CalendarContext);
}