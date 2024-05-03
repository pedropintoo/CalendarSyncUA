import Calendar from "./Calendar";
import React, { useState } from 'react';
import Filter from "./Filter";
import Tasks from "./Tasks";

interface EventICSProps {
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    location?: string;
    rawData: string; // raw ics data
  }

function MainStructure() {
    
    const [allEventsICS, setAllEventsICS] = useState<EventICSProps[]>([]);
    const [filteredEventsICS, setFilteredEventsICS] = useState<EventICSProps[]>([]);

    // Function to add a new event
    const handleAddEvent = (newEvent: EventICSProps) => {
        setAllEventsICS([...allEventsICS, newEvent]);
    };

    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <Filter allEvents={allEventsICS} setFilteredEvents={setFilteredEventsICS} />
            <Calendar allEvents={allEventsICS} filteredEvents={filteredEventsICS} setAllEvents={setAllEventsICS} />
            <Tasks allEvents={filteredEventsICS} />
        </div>
        </>
     );
}

export default MainStructure;