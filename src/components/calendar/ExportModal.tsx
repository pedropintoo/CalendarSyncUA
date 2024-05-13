import { ChangeEvent, useState } from "react";
import { useCalendarContext } from "../contexts/CalendarContext";
import { EventICSProps, useStructureContext } from "../contexts/StructureContext";
import TaskEvent from "../tasks/TaskEvent";
import { titleCase } from "../MainStructure";

function ExportModal() {
    const SC = useStructureContext();
    const CC = useCalendarContext();

    const [unselectedEvents, setUnselectedEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const downloadICS = () => {
        const icsHeader = [
            'BEGIN:VCALENDAR',
            'METHOD:PUBLISH',
            'PRODID:-//Your Organization//NONSGML Your Product Name//EN',
            'VERSION:2.0'
        ].join('\n');

        const icsEvents = SC.filteredEventsICS.map(event => {
            if (!isEventChecked(event)) {
                return false;   
            }
            const now = new Date().toISOString().replace(/-|:|\.\d{3}/g, '');
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
    };


    if (!CC.isExportOpen) return null;

    const handleClose = () => {
        console.log('Export');
        CC.setExportOpen(false);
        setUnselectedEvents([]);
    }

    function isEventChecked(event: EventICSProps): boolean {
        return (!unselectedEvents.includes(event.id) && SC.filteredEventsICS.includes(event)) || (selectedEvents.includes(event.id) &&  SC.allEventsICS.includes(event));
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
            setSelectedEvents([...selectedEvents, ...SC.allEventsICS.filter(e => !SC.filteredEventsICS.includes(e) && e.tagName === tagName).map(e => e.id) ]);
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
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg">
                            Export Events to ICS
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleClose}>
                            <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className='p-4 md:p-5 h-[50rem]'>
                        <div className="grid grid-cols-3">
                            <p className={` col-span-2 text-xl font-bold py-3`}>Confirmation:</p>
                            <button type="submit" className={` text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-sky-600 hover:bg-sky-500`} onClick={downloadICS}>
                                Export ({countCheckedEvents()})
                            </button>
                        </div>
                        <div className="m-1 my-3 border-2 border-gray-200">
                            <ul className={`${Object.keys(SC.tags).length < 8? '' : 'h-64' } px-2 py-2 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton`}>
                                {Object.keys(SC.tags).map((tagName) => (
                                <li>
                                    <label htmlFor={`id-${tagName}`} className="flex h-8 items-center rounded hover:bg-sky-600 text-gray-900 hover:text-gray-50  ">
                                    <div className="w-full ms-2 text-sm font-medium  rounded">
                                        <input checked={isTagChecked(tagName)} onChange={(event) => handleTagCheckBox(event, tagName)} id={`id-${tagName}`} type="checkbox" value="" className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 hover:text-gray-50 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <span>
                                        {titleCase(tagName.replace(/[0-9]+[-]/, ''))}
                                        </span>
                                    </div>
                                    </label>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <p className={` col-span-2 text-xl font-bold py-3`}>Selected ({countCheckedEvents()})</p>
                        <div className={`${SC.filteredEventsICS.length == 0 ? '' : 'h-96'} `} >
                        <ul className="overflow-y-auto h-full">
                            {SC.allEventsICS.length == 0? <></> :  
                            SC.allEventsICS.sort((a, b) => a.tagName == b.tagName ? 0 : a.tagName < b.tagName ? -1 : 1).map(event => (
                                <li key={event.id}>
                                <input type="checkbox" id={`${event.id}`} value="" className="hidden peer"
                                    onChange={() => {}} // dummy function
                                    checked={isEventChecked(event)}></input>
                                <label htmlFor="react-option" className="my-1 mt-3 p-0 inline-flex items-center justify-between w-full rounded-lg cursor-pointer border-2 border-gray-200 peer-checked:border-sky-600 hover:bg-gray-100"
                                onClick={() => handleCheckboxChange(event.id)}>                           
                                    <TaskEvent isActive={false} key={event.id} event={event} />
                                </label>
                                </li>
                            ))}
                            </ul>
                        </div>
                        <div className={`${SC.filteredEventsICS.length !== 0 ? 'hidden' : 'flex'} items-center justify-center`}>
                            <p className="text-xl font-bold py-3 flex items-center">
                                No events to export
                                <img className="ml-2 h-6 w-6" alt="Error icon" src="https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Error_warning_alert_attention_remove_dialog.png" />
                            </p>
                        </div>



                    </form>
                </div>
            </div>
        </>
    );
};

export default ExportModal;



// Helper functions
function formatDateToICS(date: Date): string {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
}

function escapeText(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}