import Calendar from "./calendar/Calendar";
import { useState } from 'react';
import Filter from "./filter/Filter";
import Tasks from "./tasks/Tasks";
import { StructureContext, useStructureContext } from "./contexts/StructureContext";
import { EventICSProps } from "./contexts/StructureContext";

function MainStructure() {
    const SC = useStructureContext();
    const [allEventsICS, setAllEventsICS] = useState<EventICSProps[]>([]);
    const [filteredEventsICS, setFilteredEventsICS] = useState<EventICSProps[]>([]);
    const [tags, setTags] = useState<{ [key: string]: string }>({});

    const handleAddEvent = (newEvent: EventICSProps) => {
        newEvent.startDate.setTime(newEvent.startDate.getTime() + newEvent.startDate.getTimezoneOffset() * 60 * 1000);
        newEvent.endDate.setTime(newEvent.endDate.getTime() + newEvent.endDate.getTimezoneOffset() * 60 * 1000);
        if (!tags[newEvent.tagName]) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            setTags(prevTags => {
                return {...prevTags, [newEvent.tagName]: color};
            });
        }
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
        handleAddEvent({id: "1", title: "Anniversary", startDate: new Date("2024-05-06T17:00:00Z"), endDate: new Date("2024-05-06T18:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "1-BD"});
        handleAddEvent({id: "2", title: "Meeting", startDate: new Date("2024-05-08T10:00:00Z"), endDate: new Date("2024-05-08T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "2-IHC"});
        handleAddEvent({id: "3", title: "Start Project", startDate: new Date("2024-04-10T12:00:00Z"), endDate: new Date("2024-04-10T18:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "3-CD"});
        handleAddEvent({id: "4", title: "Holidays", startDate: new Date("2024-05-13T10:00:00Z"), endDate: new Date("2024-05-15T12:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "4-PDS"});
        handleAddEvent({id: "5", title: "Special Dinner", startDate: new Date("2024-05-13T14:00:00Z"), endDate: new Date("2024-05-13T17:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "5-C"});
        handleAddEvent({id: "6", title: "Special Dinner", startDate: new Date("2024-05-06T14:00:00Z"), endDate: new Date("2024-05-06T17:00:00Z"), description: "Meeting with the team", location: "Office", rawData: rawData, tagName: "6-C"});
    }
    
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <StructureContext.Provider value={{allEventsICS, setAllEventsICS, filteredEventsICS, setFilteredEventsICS, tags, setTags, isEditEventOpen, setEditEventOpen}}>
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

export const colors = [
    "#F87171", "#F87171", "#F87171", // red
    "#34D399", "#34D399", "#34D399", // green
    "#3B82F6", "#3B82F6", "#3B82F6", // blue
    "#F97316", "#F97316", "#F97316", // orange
    "#818CF8", "#818CF8", "#818CF8", // indigo
    "#A855F7", "#A855F7", "#A855F7", // purple
]
    