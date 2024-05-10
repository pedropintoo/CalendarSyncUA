import Calendar from "./calendar/Calendar";
import React, { useState } from 'react';
import Filter from "./filter/Filter";
import Tasks from "./tasks/Tasks";
import { StructureContext } from "./contexts/StructureContext";
import { EventICSProps } from "./contexts/StructureContext";

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
        handleAddEvent({id: "1", title: "Meeting", startDate: new Date("2024-05-06T10:00:00Z"), endDate: new Date("2024-05-06T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "BD"});
        handleAddEvent({id: "2", title: "Meeting", startDate: new Date("2024-05-08T10:00:00Z"), endDate: new Date("2024-05-08T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "IHC"});
        handleAddEvent({id: "3", title: "Meeting", startDate: new Date("2024-05-10T10:00:00Z"), endDate: new Date("2024-05-10T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "CD"});

    }

    const tags = {
        "BD": "#ef4444", // red
        "C": "#ca8a04", // yellow
        "CD": "#047857", // green
        "IHC": "#2563eb", // blue
        "PDS": "#f97316" // orange
    }
    
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <StructureContext.Provider value={{allEventsICS, setAllEventsICS, filteredEventsICS, setFilteredEventsICS, tags}}>
                <Filter/>
                <Calendar/>
                <Tasks/>
            </StructureContext.Provider>
        </div>
        <button onClick={addDEMOData} className="btn-square bg-sky-900 text-slate-50 w-100">Demo data</button>
        </>
     );
}

export default MainStructure;