import React, { useState } from 'react';
import { useStructureContext } from '../contexts/StructureContext';

function Filter() {
  // Structure Context
  const SC = useStructureContext();

  const [selectAll, setSelectAll] = useState(false);
  const [selectedTags, setSelectedTags] = useState({});

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const newSelectedTags = {};
    Object.keys(SC.tags).forEach(tagName => {
      newSelectedTags[tagName] = !selectAll;
    });
    setSelectedTags(newSelectedTags);
    filterEvents(newSelectedTags);
  };

  const handleTagCheckboxChange = (tagName) => {
    const newSelectedTags = {
      ...selectedTags,
      [tagName]: !selectedTags[tagName]
    };
    setSelectedTags(newSelectedTags);
    const allSelected = Object.values(newSelectedTags).every(value => value);
    setSelectAll(allSelected);
    filterEvents(newSelectedTags);
  };

  const filterEvents = (selectedTags) => {
    const filteredEvents = SC.allEventsICS.filter(event => {
        return selectedTags[event.tagName];
    });

    console.log('Filtered Events:', filteredEvents); // Adicionando o console.log

    SC.setFilteredEventsICS(filteredEvents);
};


  return (
    // <!-- Main  -->
    <>
      <div className="border-solid bg-slate-200 border-2 border-sky-600 rounded">
        <div className="py-5 px-5 flex justify-center border-solid border-b-2 border-sky-600">
          <h1 className="">Filter</h1>
        </div>
        <div key="Tags" className="flex items-center mb-5 border-solid border-b-2 pb-3 pt-3 border-sky-600">
          <input type="checkbox" id="selectAll" className="mr-2 ml-3" checked={selectAll} onChange={handleSelectAll} />
          <label htmlFor="selectAll" className="text-bg text-black-500 ml-2">Select All</label>
        </div>
        {Object.entries(SC.tags).map(([tagName, colorClass]) => (
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id={tagName}
              className="mr-2 ml-3"
              checked={selectedTags[tagName] || false}
              onChange={() => handleTagCheckboxChange(tagName)}
            />
            <label htmlFor={tagName} className={`text-bg ${colorClass[0]} ml-2`}>
              {tagName}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default Filter;