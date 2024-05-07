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
    tagName: string;
    tagColor: string;
}


function MainStructure() {
    
    const [allEventsICS, setAllEventsICS] = useState<EventICSProps[]>([]);
    const [filteredEventsICS, setFilteredEventsICS] = useState<EventICSProps[]>([]);

    const handleAddEvent = (newEvent: EventICSProps) => {
        setAllEventsICS(prevEvents => {
            const updatedEvents = [...prevEvents, newEvent];
            console.log(updatedEvents); 
            return updatedEvents;
        });
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
        handleAddEvent({id: "1", title: "Meeting", startDate: new Date("2024-05-06T10:00:00Z"), endDate: new Date("2024-05-06T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "BD", tagColor: tags.BD[1]});
        handleAddEvent({id: "2", title: "Meeting", startDate: new Date("2024-05-08T10:00:00Z"), endDate: new Date("2024-05-08T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "IHC", tagColor: tags.IHC[1]});
        handleAddEvent({id: "3", title: "Meeting", startDate: new Date("2024-05-10T10:00:00Z"), endDate: new Date("2024-05-10T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "CD", tagColor: tags.CD[1]});

    }

    const tags = {
        "BD": ["text-red-500", "bg-red-500"],
        "C": ["text-green-500", "bg-green-500"],
        "CD": ["text-yellow-500", "bg-yellow-500"],
        "IHC": ["text-blue-500", "bg-blue-500"],
        "PDS": ["text-orange-500", "bg-orange-500"]
    }
    
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <Filter tags={tags} allEvents={allEventsICS} setFilteredEvents={setFilteredEventsICS} />
            <Calendar allEvents={allEventsICS} filteredEvents={filteredEventsICS} setAllEvents={setAllEventsICS} />
            <Tasks/>
        </div>
        <button onClick={addDEMOData} className="btn-square bg-sky-900 text-slate-50 w-100">Demo data</button>
        </>
     );
}

export default MainStructure;