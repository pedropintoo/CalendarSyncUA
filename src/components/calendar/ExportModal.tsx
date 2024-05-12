import { MouseEventHandler, useCallback, useState } from "react";
import { useCalendarContext } from "../contexts/CalendarContext";
import { EventICSProps, StructureContextType, useStructureContext } from "../contexts/StructureContext";
import { colors } from "../MainStructure";
import TaskEvent from "../tasks/TaskEvent";

function ExportModal() {
    const { filteredEventsICS } = useStructureContext();

    const downloadICS = () => {
        const icsHeader = [
            'BEGIN:VCALENDAR',
            'METHOD:PUBLISH',
            'PRODID:-//Your Organization//NONSGML Your Product Name//EN',
            'VERSION:2.0'
        ].join('\n');

        const icsEvents = filteredEventsICS.map(event => {
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
        }).join('\n');

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

    const CC = useCalendarContext();
    const SC = useStructureContext();
    const [isExportOpen, setExportOpen] = useState(false);

    if (!CC.isExportOpen) return null;

    const handleClose = () => {
        console.log('Export');
        CC.setExportOpen(false);
    }


    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className='relative p-8 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg '>
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
                    <form className='p-4 md:p-5 overflow-y-auto'>
                        <div className={`${filteredEventsICS.length == 0 ? '' : 'h-80'} `} >


                            {filteredEventsICS.length == 0 ? <></> :
                                filteredEventsICS.sort((a, b) => a.tagName == b.tagName ? 0 : a.tagName < b.tagName ? -1 : 1).map(event => (
                                    <TaskEvent key={event.id} event={event} handleEvent={function (): void {
                                        return;
                                    }} />
                                ))}
                        </div>
                        <div className={`${filteredEventsICS.length !== 0 ? 'hidden' : 'flex'} items-center justify-center`}>
                            <p className="text-xl font-bold py-3 flex items-center">
                                No events to export
                                <img className="ml-2 h-6 w-6" alt="Error icon" src="https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Error_warning_alert_attention_remove_dialog.png" />
                            </p>
                        </div>



                    </form>
                    <div className="grid grid-cols-2">
                        <p className={`${filteredEventsICS.length == 0 ? 'invisible' : ''} text-xl font-bold py-3`}>Confirmation:</p>
                        <div className="grid grid-cols-2">
                            <button type="submit" className={`${filteredEventsICS.length == 0 ? 'invisible' : ''} text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-sky-600 hover:bg-sky-500`} onClick={downloadICS}>
                                Confirm
                            </button>
                            <button type="button" className=" text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-gray-500 hover:bg-gray-400" onClick={handleClose}>
                                Close
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



// Helper functions
function formatDateToICS(date: Date): string {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
}

function escapeText(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}