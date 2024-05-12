import { useEffect, useState } from 'react';
import { useStructureContext } from '../contexts/StructureContext';
import { titleCase } from '../MainStructure';

function Filter() {
  // Structure Context
  const SC = useStructureContext();

  const [selectAll, setSelectAll] = useState(true);
  const [selectedTags, setSelectedTags] = useState(SC.tags);


  const handleSelectAll = () => {
    setSelectAll(!selectAll); // flip the selectAll state
    const newSelectedTags = {} as {[key: string]: boolean};
    Object.keys(SC.tags).map(tagName => {
      newSelectedTags[tagName] = !selectAll; // apply the flipped selectAll state to all tags
    });
    setSelectedTags(newSelectedTags);
  };

  const handleTagCheckboxChange = (tagName: string) => {
    const newSelectedTags = {
      ...selectedTags,
      [tagName]: !selectedTags[tagName]
    };
    setSelectedTags(newSelectedTags);
    const allSelected = Object.values(newSelectedTags).every(value => value);
    setSelectAll(allSelected);
  };

  // Update the filtered events when dependencies change
  useEffect(() => {
    const filteredEvents = SC.allEventsICS.filter(event => selectedTags[event.tagName]);
    filteredEvents.sort((a, b) => a.startDate == b.startDate ? 0 : a.startDate < b.startDate ? -1 : 1);
    
    SC.setFilteredEventsICS(filteredEvents);
    console.log('Filtered Events:', filteredEvents);
  }, [selectedTags, SC.allEventsICS]); // Dependency in selectedTags and SC.allEventsICS

  useEffect(() => {
    if (selectAll) {
      setSelectedTags(SC.tags);
    }
  }, [SC.tags]);

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
        {Object.entries(SC.tags).map(([tagName]) => (
          <div key={tagName} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={tagName}
              className="mr-2 ml-3"
              checked={selectedTags[tagName]}
              onChange={() => handleTagCheckboxChange(tagName)}
            />
            <label htmlFor={tagName} className={`text-bg ml-2`} style={{ color: `${SC.tags[tagName]}`}}>
              {titleCase(tagName.split('-')[1])}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default Filter;
