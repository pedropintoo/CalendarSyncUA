import { useEffect, useState } from 'react';
import { useStructureContext } from '../contexts/StructureContext';
import { titleCase } from '../MainStructure';
import './styles.css';




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
        <label htmlFor="selectAll" className="cursor-pointer text-bg text-black-500 ml-2 me-2 rounded h-10 my-2 hover:bg-gray-300 hover:bg-opacity-80 text-gray-900 flex items-center border-solid border-b-2 pb-3 pt-3 border-sky-600">
        <div key="Tags" className=" ">
          <input type="checkbox" id="selectAll" className="mr-2 ml-3" checked={selectAll} onChange={handleSelectAll} />
          <span>
          Select All
            </span>
        </div>
        </label>
        <ul className={`px-2 text-sm text-gray-700 dark:text-gray-200"`}>
        {Object.entries(SC.tags).map(([tagName]) => (
          <li key={tagName}>
          <input type="checkbox" id={tagName} value="" className="hidden peer"
            onChange={() => {}} // dummy function
            checked={selectedTags[tagName]}></input>
          <label htmlFor="react-option"
          style={{
            border: `2px solid ${selectedTags[tagName] ? SC.tags[tagName] : '#d1d5db'}` 
          }}
          className={`my-1 mt-3 p-0 text-sm font-medium inline-flex items-center justify-between w-full rounded-lg cursor-pointer border-2 hover:bg-gray-300`}
          onClick={() => handleTagCheckboxChange(tagName)}>                           
            <p className='mx-5 my-2 '>
                {titleCase(tagName.split('-')[1])}
              </p>
          </label>
        </li>
        ))}
        </ul>
      </div>
    </>
  );
}

export default Filter;

{/* <label htmlFor={tagName} className="cursor-pointer overflow-x-auto flex py-5 my-1 h-8 items-center rounded hover:bg-sky-600 hover:bg-opacity-80 text-gray-900 hover:text-gray-50  ">
            <div className="w-full ms-2 text-sm font-medium  rounded">
              <input style={{accentColor: SC.tags[tagName]}} checked={selectedTags[tagName]} onChange={() => handleTagCheckboxChange(tagName)} id={tagName} type="checkbox" value="" className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 hover:text-gray-50 rounded dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
              <span>
                {titleCase(tagName.split('-')[1])}
              </span>
            </div>
          </label> */}

// <div key={tagName} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               id={tagName}
//               className="mr-2 ml-3"
//               checked={selectedTags[tagName]}
//               onChange={() => handleTagCheckboxChange(tagName)}
//             />
//             <label htmlFor={tagName} className={`text-bg ml-2`} style={{ color: `${SC.tags[tagName]}`}}>
//               {titleCase(tagName.split('-')[1])}
//             </label>
//           </div>