import { useCalendarContext } from "../contexts/CalendarContext";


const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
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
          //console.log('File uploaded:', responseData);


      } catch (error) {
          console.error('Error uploading file:', error.message);
      }
  }
};


function ImportModal(){
  const CC = useCalendarContext();

  const handleClose = () =>{
    CC.setImportOpen(false);
  }
  
  if (!CC.isImportOpen) return null;
  return (
      <>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className='relative p-4 w-full max-w-md max-h-full bg-white p-8 rounded-lg shadow-lg'>
              <button type="button" className="ml-auto text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2.5 py-1 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleClose}>X</button>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">ICS file only</p>
                  </div>
                  <input id="dropzone-file" type="file" accept=".ics" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>
      </>
  );
};

export default ImportModal;
