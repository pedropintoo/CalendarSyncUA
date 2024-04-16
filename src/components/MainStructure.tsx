import Filter from "./Filter";
import Tasks from "./Tasks";

function MainStructure() {
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 md:h-screen">
            <Filter/>
            <div className="bg-gray-200 lg:col-span-4 rounded-lg"></div>
            <Tasks/>
        </div>
        </>
     );
}

export default MainStructure;