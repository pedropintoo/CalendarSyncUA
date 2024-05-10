import React, { useState } from 'react';
import { useStructureContext } from '../contexts/StructureContext';
import { CalendarContext, useCalendarContext } from '../contexts/CalendarContext';

interface AddEventForm {
  title: string;
  description: string;
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  tag: string;
}

function AddEventModal(){
    const SC = useStructureContext();
    const CC = useCalendarContext();
    const [form, setForm] = useState<AddEventForm>({
      title: '',
      description: '',
      startDate: '',
      startHour: '',
      endDate: '',
      endHour: '',
      tag: '',
    });

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm({...form, [event.target.name]: event.target.value });
    };


    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Create a new event with the form data
      const startDate = new Date(`${form.startDate}T${form.startHour}:00.000Z`);
      const endDate = new Date(`${form.endDate}T${form.endHour}:00.000Z`);
      const newEvent = {
        id: "4",
        title: form.title,
        description: form.description,
        startDate,
        endDate,
        tagName: form.tag,
        tagColor: SC.tags[form.tag][1],
      };
      SC.setAllEventsICS(prevEvents => {
        const updatedEvents = [...prevEvents, newEvent];
        console.log(updatedEvents); 
        return updatedEvents;
        });
        CC.setAddEventOpen(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <form onSubmit={handleFormSubmit}>
                <label>
                  Title:
                  <input type="text" name="title" value={form.title} onChange={handleFormChange} />
                </label>
                <label>
                  Description:
                  <textarea name="description" value={form.description} onChange={handleFormChange} />
                </label>
                <label>
                  Start Date:
                  <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} />
                </label>
                <label>
                  Start Hour:
                  <input type="time" name="startHour" value={form.startHour} onChange={handleFormChange} />
                </label>
                <label>
                  End Date:
                  <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} />
                </label>
                <label>
                  End Hour:
                  <input type="time" name="endHour" value={form.endHour} onChange={handleFormChange} />
                </label>
                <label>
                  Tag:
                  <select name="tag" value={form.tag} onChange={handleFormChange}>
                      <option value="">Select a tag</option>
                      {Object.entries(SC.tags).map(([tagName, colorClass]) => (
                        <option key={tagName} value={tagName} className="mr-2 ml-3" />
                      ))}
                  </select>
                </label>
                <button type="submit">Confirm</button>
              </form>
            </div>
      </>
    );
};

export default AddEventModal;