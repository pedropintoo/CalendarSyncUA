import {createContext} from 'react';
import React from 'react';

export interface CalendarContextType {
    currentMonth: number;
    currentYear: number;
    setMonth: (month: React.SetStateAction<number>) => void;
    setYear: (year: React.SetStateAction<number>) => void;
}



export const CalendarContext = createContext<CalendarContextType>({
    currentMonth: new Date().getMonth() + 1,
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