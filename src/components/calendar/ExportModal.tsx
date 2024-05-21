import { ChangeEvent, useState } from "react";
import { useCalendarContext } from "../contexts/CalendarContext";
import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import TaskEvent from "../tasks/TaskEvent";
import { titleCase } from "../MainStructure";

function CancelPageRefresh(event: any) {
    event.preventDefault(); // Prevents the default form submission behavior  
}

function ExportModal() {
    const SC = useStructureContext();
    const CC = useCalendarContext();

    const [unselectedEvents, setUnselectedEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [isDone, setIsDone] = useState(false);

    const downloadICS = () => {
        const icsHeader = [
            'BEGIN:VCALENDAR',
            'METHOD:PUBLISH',
            'PRODID:-//CalendarSync//UA//EN',
            'VERSION:2.0'
        ].join('\n');

        const icsEvents = SC.filteredEventsICS.map(event => {
            if (!isEventChecked(event)) {
                return false;
            }
            const now = new Date().toISOString().replace(/-|:|\.\d{3}/g, '');
            console.log("Export Date" + event.startDate)
            console.log("Export Date ICS" + event.startDate.toISOString())
            return [
                'BEGIN:VEVENT',
                `UID:${event.id}@CalendarSyncUA.com`, // UID should be unique
                `SUMMARY:${escapeText(event.title)}`,
                `DESCRIPTION:${escapeText(event.description || '')}`,
                'CLASS:PUBLIC',
                `LAST-MODIFIED:${now}`,
                `DTSTAMP:${now}`,
                `DTSTART:${formatDateToICS(event.startDate)}`,
                `DTEND:${formatDateToICS(event.endDate)}`,
                `CATEGORIES:${event.tagName}`,
                'END:VEVENT'
            ].join('\n');
        }).filter(Boolean).join('\n');


        const icsFooter = 'END:VCALENDAR';
        // Prevent the page from refreshing
        const form = document.querySelector('form');
        if (form !== null) {
            form.addEventListener('submit', CancelPageRefresh);
        }
        const icsString = [icsHeader, icsEvents, icsFooter].join('\n');
        const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'events.ics';
        document.body.appendChild(link); // Needed for Firefox
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDone(true)
    };


    if (!CC.isExportOpen) return null;

    const handleClose = () => {
        console.log('Export');
        CC.setExportOpen(false);
        setUnselectedEvents([]);
    }

    function isEventChecked(event: EventICSProps): boolean {
        return (!unselectedEvents.includes(event.id) && SC.filteredEventsICS.includes(event)) || (selectedEvents.includes(event.id) && SC.allEventsICS.includes(event));
    }

    function countCheckedEvents(): number {
        return SC.allEventsICS.filter(event => isEventChecked(event)).length;
    }

    function handleCheckboxChange(id: string): void {
        // remove from selected events if it is there
        if (selectedEvents.includes(id)) {
            setSelectedEvents(selectedEvents.filter(i => i !== id));
            return;
        }

        // remove from unselected events if it is there
        if (unselectedEvents.includes(id)) {
            setUnselectedEvents(unselectedEvents.filter(i => i !== id));
            return;
        }

        // is in filtered events
        if (SC.filteredEventsICS.map(event => event.id).includes(id)) {
            setUnselectedEvents([...unselectedEvents, id]);
            return
        }

        // is not in filtered events
        setSelectedEvents([...selectedEvents, id]);
    }

    function handleTagCheckBox(event: ChangeEvent<HTMLInputElement>, tagName: string): void {
        if (event.target.checked) {
            // remove from unselected events if it is there
            const filteredUnselected = SC.filteredEventsICS.filter(e => !isEventChecked(e));
            setUnselectedEvents(unselectedEvents.filter(i => filteredUnselected.find(e => e.id === i)?.tagName !== tagName));

            // add all events with the tag to selected events
            setSelectedEvents([...selectedEvents, ...SC.allEventsICS.filter(e => !SC.filteredEventsICS.includes(e) && e.tagName === tagName).map(e => e.id)]);
            return;
        }

        // add all filtered events with the tag to unselected events
        setUnselectedEvents([...unselectedEvents, ...SC.filteredEventsICS.filter(e => e.tagName === tagName).map(e => e.id)]);

        // remove all selected events with the tag
        const normalSelected = SC.allEventsICS.filter(e => !SC.filteredEventsICS.includes(e) && !isEventChecked(e));
        setSelectedEvents(selectedEvents.filter(i => normalSelected.find(e => e.id === i)?.tagName !== tagName));
    }

    function isTagChecked(tagName: string): boolean | undefined {
        return !SC.allEventsICS.some(event => event.tagName === tagName && !isEventChecked(event));
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className='relative p-8 w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg'>
                    <div className={` ${isDone ? 'hidden' : ''} flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600`}>
                        <h3 className={`  text-lg`}>
                            Export Events to ICS
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleClose}>
                            <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className={`${isDone ? 'hidden' : ''} ${SC.allEventsICS.length !== 0 ? 'h-[50rem]' : ''} p-4 md:p-5 overflow-y-auto `}>
                        <div className={`${SC.allEventsICS.length !== 0 ? '' : 'hidden'} grid grid-cols-3`}>
                            <p className={` col-span-2 text-xl font-bold py-3`}>Confirmation:</p>
                            <button type="submit" className={` text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-sky-600 hover:bg-sky-500`} onClick={downloadICS}>
                                Export ({countCheckedEvents()})
                            </button>
                        </div>
                        <div className={`${SC.allEventsICS.length !== 0 ? '' : 'hidden'} m-1 my-3 border-2 border-gray-200`}>
                            <ul className={`${Object.keys(SC.tags).length < 8 ? '' : 'h-64'} px-2 py-2 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton`}>
                                {Object.keys(SC.tags).map((tagName) => (
                                    <li>
                                        <label htmlFor={`id-${tagName}`} className="flex h-8 items-center rounded hover:bg-sky-600 text-gray-900 hover:text-gray-50  ">
                                            <div className="w-full ms-2 text-sm font-medium  rounded">
                                                <input checked={isTagChecked(tagName)} onChange={(event) => handleTagCheckBox(event, tagName)} id={`id-${tagName}`} type="checkbox" value="" className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 hover:text-gray-50 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <span>
                                                    {titleCase(tagName.replace(/[0-9]+[-]/, ''))}
                                                </span>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className={`${SC.allEventsICS.length !== 0 ? '' : 'hidden'} col-span-2 text-xl font-bold py-3`}>Selected ({countCheckedEvents()})</p>
                        <div className={`${SC.allEventsICS.length == 0 ? '' : 'h-96'} `} >
                            <ul className="h-full">
                                {SC.allEventsICS.length == 0 ? <></> :
                                    SC.allEventsICS.sort((a, b) => a.tagName == b.tagName ? 0 : a.tagName < b.tagName ? -1 : 1).map(event => (
                                        <li key={event.id}>
                                            <input type="checkbox" id={`${event.id}`} value="" className="hidden peer"
                                                onChange={() => { }} // dummy function
                                                checked={isEventChecked(event)}></input>
                                            <label htmlFor="react-option" className="my-1 mt-3 p-0 inline-flex items-center justify-between w-full rounded-lg cursor-pointer border-2 border-gray-200 peer-checked:border-sky-600 hover:bg-gray-100"
                                                onClick={() => handleCheckboxChange(event.id)}>
                                                <TaskEvent isActive={false} key={event.id} event={event} />
                                            </label>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className={`${SC.allEventsICS.length !== 0 ? 'hidden' : ''} text-lg bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4`} role="alert">
                            <p className="font-bold">No events to export</p>
                            <p>Try to import and filter first.</p>
                        </div>
                    </form>

                    <div
                        role="alert"
                        data-dismissible="alert"
                        className={`${isDone ? '' : 'hidden'} relative flex w-full max-w-screen-md px-4 py-4 text-green-700 rounded-lg font-regular`}>
                        <div className="shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fill-rule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="ml-3 grid grid-cols-3 w-full">
                            <div className="col-span-2">
                                <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal">
                                    Success
                                </h5>
                                <p className="block mt-2 font-sans text-lg antialiased leading-relaxed">
                                    Your events have been exported successfully.
                                </p>
                            </div>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleClose}>
                                <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ExportModal;



function formatDateToICS(date: Date): string {
    return formatDateToICSLocal(date).replace(/-|:|\.\d{3}/g, '') + 'Z';
}

function formatDateToICSLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}


function escapeText(text: string): string {
    return text.replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}
