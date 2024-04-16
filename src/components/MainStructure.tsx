function MainStructure() {
    return ( 
        // <!-- Main -->
        <>
            <div className="px-4 py-2 mx-auto grid md:grid-cols-6 gap-2">
                <div className="bg-red-300">left side</div>
                <div className="bg-green-200 md:col-span-4 pl-2">main</div>
                <div className="bg-red-300">right side</div>
            </div>
        </>
     );
}

export default MainStructure;