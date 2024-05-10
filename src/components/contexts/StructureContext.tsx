import {createContext} from 'react';
import React from 'react';

export interface EventICSProps {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    location?: string;
    rawData: string; // raw ics data
    tagName: string;
}

export interface StructureContextType {
    allEventsICS: EventICSProps[];
    setAllEventsICS: (events: EventICSProps[]) => void;
    filteredEventsICS: EventICSProps[];
    setFilteredEventsICS: (events: EventICSProps[]) => void;
    tags: { [key: string]: string };
}

// Initialize the context with default values, including the tags object
export const StructureContext = createContext<StructureContextType>({
    allEventsICS: [],
    setAllEventsICS: (_: EventICSProps[]) => {},
    filteredEventsICS: [],
    setFilteredEventsICS: (_: EventICSProps[]) => {},
    tags: {}
});

export const useStructureContext = () => {
    if (React.useContext(StructureContext) === undefined) {
        throw new Error('useStructureContext must be used within a StructureProvider');
    }
    return React.useContext(StructureContext);
}