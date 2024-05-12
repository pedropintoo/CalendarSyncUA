import { MouseEventHandler, useCallback, useState } from "react";
import { useCalendarContext } from "../contexts/CalendarContext";
import { EventICSProps, StructureContextType, useStructureContext } from "../contexts/StructureContext";
import { colors } from "../MainStructure";
import TaskEvent from "../tasks/TaskEvent";


const handleFileUpload = (SC: StructureContextType, setEventsToImport: React.Dispatch<React.SetStateAction<EventICSProps[]>>) => async (event: React.ChangeEvent<HTMLInputElement>) => {
  
  const fetchLastEventId = (eventsToImport : EventICSProps[]) => {
    if (eventsToImport.length > 0) {
      const lastEvent = eventsToImport[eventsToImport.length - 1];
      return parseInt(lastEvent.id) + 1;
    }
    const lastEvent = SC.allEventsICS[SC.allEventsICS.length - 1];
    if (lastEvent) {
      return parseInt(lastEvent.id) + 1;
    } else {
      return 1;
    }
  };

  const eventsToImport = [] as EventICSProps[];

  if (!event.target.files) return;

  for (const file of event.target.files) {
    if (file) {
      try {
        // Create a FormData object to send the file

        // Make a POST request to the backend server
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: file,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        // Parse response JSON
        
        const responseData = await response.json();
        const decodedData = decodeURIComponent(responseData);
        console.log("Response data: ", decodedData);
        
        
        Object.keys(responseData).forEach(entry => {
          if (responseData[entry]["type"] !== "VEVENT") {
            console.log("Not an event: ", responseData[entry]);
            return;
          }
          const data = responseData[entry];
          // Create a new event with the data from the response
          const startDate = new Date(data['start']);
          startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
          const endDate = new Date(data['end']);
          endDate.setTime(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);

          const eventId = fetchLastEventId(eventsToImport);

          let tagName = data['description'].split(':')[0];
          if (data['categories'] !== undefined){
            tagName = data['categories'][0];
          }
          
          console.log("Tag name: ", tagName);
          if (SC.tags[tagName] === undefined) {
            // if not found, search for a tag that contains the first part of the tag name
            for (const tag in SC.tags)  {
              console.log("Tag: ", tag, tagName.split('-')[0]);
              if (tag.includes(tagName.split('-')[0])) {
                tagName = tag;
                break;
              }
            }
          }

          const newEvent = {
            id: eventId.toString(),
            title: data['summary'],
            description: data['description'],
            startDate,
            endDate,
            tagName: tagName
          };

          // Add the new event to the list of events
          eventsToImport.push(newEvent);
          console.log("Import event: ", newEvent);
        });
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }
  }
  // sort by tag
  setEventsToImport(eventsToImport);
  
};


function ImportModal(){
  const CC = useCalendarContext();
  const SC = useStructureContext();

  const [eventsToImport, setEventsToImport ] = useState<EventICSProps[]>([]);

  const handleClose = () =>{
    CC.setImportOpen(false);
  }

  function handleConfirm() {
    console.log("Events to import: ", eventsToImport);
    let newTags = {}
    eventsToImport.forEach(event => {
      if (SC.tags[event.tagName] === undefined) {
        newTags = {...newTags, [event.tagName]: colors[Math.floor(Math.random() * colors.length)]};
      }
    });
    SC.setTags({...SC.tags, ...newTags});
    SC.setAllEventsICS([...SC.allEventsICS, ...eventsToImport]);
    CC.setImportOpen(false);
  }
  
  if (!CC.isImportOpen) return null;

  const openElearning: MouseEventHandler<HTMLButtonElement> = (event) => {
    // Prevent any default behavior if needed
    event.preventDefault();
    
    // Open the e-learning page in a new tab
    window.open("https://elearning.ua.pt/calendar/export.php?", '_blank');
  };
  
  const openPaco: MouseEventHandler<HTMLButtonElement> = (event) => {
    // Prevent any default behavior if needed
    event.preventDefault();
    
    // Open the e-learning page in a new tab
    window.open("https://paco2.ua.pt/exams-calendar", '_blank');
  };

  return (
      <>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className='relative p-8 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg'>
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg">
                      Import ICS Files
                  </h3>
                  <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleClose}>
                      <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                  </button>
              </div>
              <form  className='p-4 md:p-5 overflow-y-auto'>
                <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 mb-3" role="alert">
                  <p className="text-sm"><b>.ics</b> files are used to store calendar information. <br />Upload it to add events to your calendar </p>
                </div>                
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-gray-500">ICS file only</p>
                  </div>
                  <input id="dropzone-file" type="file" multiple accept=".ics" className="hidden"  onChange={handleFileUpload(SC, setEventsToImport)} />
                </label>
                <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 my-3 shadow-md" role="alert">
                  <div className="flex">
                    <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                    <div>
                      <p className="font-bold">Download <b>.ics</b> files</p>
                      <p className="text-sm">Hear are some links where you can download <b>.ics</b> files.</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="my-4">
                          <button type="submit" onClick={openElearning} className="text-white hover:text-gray-100 inline-flex items-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:outline-none focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                          <img className="me-2" src="https://elearning.ua.pt/pluginfile.php/1/core_admin/favicon/64x64/1707728245/favicon.png" alt="eLearning"/>
                              eLearning
                          </button>
                        </div>
                        <div className="my-4">
                          <button type="submit" onClick={openPaco} className="text-white hover:text-gray-100 inline-flex items-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:outline-none focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                          <img className="me-2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEWAAAD///+7aYsFAAAAKklEQVR4AWNgYGQAAvs/UAQEQBH7/wzKMxlsyxgMyxh0wchwJsP//0AEAPI1DRQU5KYeAAAAAElFTkSuQmCC" alt="eLearning"/>
                              Paco
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${eventsToImport.length == 0? '' : 'h-40'} `} >
                  <div className="grid grid-cols-2">
                  <p className={`${eventsToImport.length == 0? 'invisible' : ''} text-xl font-bold py-3`}>Confirmation:</p>
                  <div className="grid grid-cols-2">
                    <button type="submit" className={`${eventsToImport.length == 0? 'invisible' : ''} text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-sky-600 hover:bg-sky-500`} onClick={handleConfirm}>
                        Confirm
                    </button>
                    <button type="button" className=" text-white inline-flex items-center font-bold py-2 px-4 m-1 rounded bg-gray-500 hover:bg-gray-400" onClick={handleClose}>
                          Close
                          <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  
                  </div>
                  
                  {eventsToImport.length == 0? <></> :  
                  eventsToImport.sort((a, b) => a.tagName == b.tagName ? 0 : a.tagName < b.tagName ? -1 : 1).map(event => (
                  <TaskEvent key={event.id} event={event} handleEvent={function (): void {
                      return;
                    } } />
                ))}
              </div>
                </form>
            </div>
              
          </div>
      </>
  );
};

export default ImportModal;
