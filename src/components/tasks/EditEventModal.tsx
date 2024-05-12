import React, { useState } from 'react';
import { EventICSProps, useStructureContext } from '../contexts/StructureContext';

const EditEventModal = ({thisEvent, setIsOpen}: {thisEvent: EventICSProps, setIsOpen : React.Dispatch<React.SetStateAction<boolean>>}) => {
  const SC = useStructureContext();
  const [form, setForm] = useState({
    title: thisEvent.title,
    description: thisEvent.description,
    startDate: thisEvent.startDate.toISOString().split('T')[0],
    startHour: thisEvent.startDate.toISOString().split('T')[1].split(':00.000Z')[0],
    endDate: thisEvent.endDate.toISOString().split('T')[0],
    endHour: thisEvent.endDate.toISOString().split('T')[1].split(':00.000Z')[0],
    tag: thisEvent.tagName,
  });

  console.log("Event to edit: ", thisEvent)
  
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({...form, [event.target.name]: event.target.value });
    console.log('Form changed:', form);
  };
  
  const closeModal = () => {
    SC.setEditEventOpen(false);
    setIsOpen(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Create a new event with the form data
    const startDate = new Date(`${form.startDate}T${form.startHour}:00.000Z`);
    startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
    const endDate = new Date(`${form.endDate}T${form.endHour}:00.000Z`);
    endDate.setTime(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);
  
    const newEvent = {
        id: thisEvent.id.toString(),
        title: form.title,
        description: form.description,
        startDate,
        endDate,
        tagName: form.tag,
        tagColor: SC.tags[form.tag][1],
    };
    SC.setAllEventsICS(prevEvents => {
        const updatedEvents = [...prevEvents, newEvent];
        delete(updatedEvents[updatedEvents.indexOf(thisEvent)])
        console.log(updatedEvents); 
        return updatedEvents;
        });
    SC.setEditEventOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-20 z-50 ">
        <div className='relative p-8 w-full max-w-2xl max-h-full bg-white p-8 rounded-lg shadow-lg'>
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg">
                      Edit Event
                  </h3>
                  <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={(e) => {e.stopPropagation(); closeModal();}}>
                      <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                  </button>
              </div>
                <form  onSubmit={handleFormSubmit} className='p-4 md:p-5'>
                    <div className='grid gap-4 mb-4 grid-cols-1'>
                      <label htmlFor='title' className='block mb-2 text-bg font-medium'>Title:</label>
                      <input type="text" name="title" id='title' value={form.title} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' placeholder='Write here' required/>
                      
                      <label htmlFor='description' className='block mb-2 text-bg font-medium'>Description:</label>
                      <textarea name="description" id='description' value={form.description} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' placeholder='Write here'/>
                    </div>
                  <div className='grid gap-4 mb-4 grid-cols-2'>
                    <label className='block mb-2 text-bg font-medium'>
                      Start Date:
                      <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' required/>
                    </label>
                    <label className='block mb-2 text-bg font-medium'>
                      End Date:
                      <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' required/>
                    </label>
                    <label className='block mb-2 text-bg font-medium'>
                      Start Hour:
                      <input type="time" name="startHour" value={form.startHour} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' required/>
                    </label>
                    <label className='block mb-2 text-bg font-medium'>
                      End Hour:
                      <input type="time" name="endHour" value={form.endHour} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' required/>
                    </label>
                  </div>
                  <div className='grid gap-4 mb-10 grid-cols-1'>
                    <label htmlFor='tag' className='block mb-2 text-bg font-medium'>
                      Tag:
                    </label>
                      <select name="tag" id='tag' value={form.tag} onChange={handleFormChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ' required>
                          <option value="">Select a tag</option>
                          {Object.entries(SC.tags).map(([tagName]) => (
                            <option key={tagName} value={tagName}>{tagName}</option>
                          ))}
                      </select>
                  </div>
                  
                <div className='grid gap-4 mb-4 grid-cols-2'>
                  <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      Save changes
                  </button>
                  <button type="button" className="text-white inline-flex items-center bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => {e.stopPropagation(); closeModal();}}>
                        Cancel
                        <span className="sr-only">Close modal</span>
                  </button>
                </div>
                </form>
              </div>
            </div>
  );
};

export default EditEventModal;