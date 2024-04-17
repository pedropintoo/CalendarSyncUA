import Calendar from "./Calendar";
import Filter from "./Filter";
import Tasks from "./Tasks";

function MainStructure() {
    return ( 
        // <!-- Main  -->
        <>
        <div className="px-4 py-4 mx-auto grid lg:grid-cols-6 gap-2 min-h-screen">
            <Filter/>
            <Calendar/>
            <Tasks/>
        </div>
        </>
     );
}

export default MainStructure;