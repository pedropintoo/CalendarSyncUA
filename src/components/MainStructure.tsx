import Calendar from "./Calendar";
import React, { useState } from 'react';
import Filter from "./Filter";
import Tasks from "./Tasks";

interface EventICSProps {
    id: string;
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

    // ONLY DEMO!!!
    const addDEMOData = () => {
        console.log("Adding demo data")
        // RAW DATA ONLY FOR DEMO
        const rawData = `BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//hacksw/handcal//NONSGML v1.0//EN
        BEGIN:VEVENT
        UID:
        DTSTAMP:20210901T000000Z
        DTSTART:20210901T100000Z
        DTEND:20210901T120000Z
        SUMMARY:Meeting
        DESCRIPTION:Meeting with the team
        LOCATION:Office
        END:VEVENT
        END:VCALENDAR`;
        handleAddEvent({id: "1", title: "Meeting", startDate: new Date("2021-09-01T10:00:00Z"), endDate: new Date("2021-09-01T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData});
    }
    
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <Filter allEvents={allEventsICS} setFilteredEvents={setFilteredEventsICS} />
            <Calendar allEvents={allEventsICS} filteredEvents={filteredEventsICS} setAllEvents={setAllEventsICS} />
            <Tasks allEvents={filteredEventsICS} />
        </div>
        <button onClick={addDEMOData} className="btn-square bg-sky-900 text-slate-50 w-100">Demo data</button>
        </>
     );
}

export default MainStructure;