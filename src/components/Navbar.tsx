function Navbar() {
    const calendar = <a href="#" className="block md:flex text-blue-700 hover:text-sky-600">Calendar</a>;
    const about = <a href="#" className="block md:flex text-gray-900 hover:text-sky-600">About</a>;
    const getStarted = <a href="#" className="flex justify-end text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2">Get started</a>
    const name = <a href="#" className="text-2xl md:flex justify-center md:col-span-4 font-semibold">CalendarSync UA</a>;
    
    return ( 
        // <!-- Navbar -->
        <nav className="px-4 py-3 shadow bg-white border-gray-200">
            <div className="mx-auto grid md:grid-cols-6 gap-0">
                
                {/* Menu for larger screens, moved towards the left */}
                <div className="hidden md:flex justify-start items-center space-x-4">
                    {calendar}
                    {about}
                </div>

                {/* Brand/Logo Area */}
                {name}
                
                {/* Get Started Button - Adjusted to be on the far right */}
                <div className="hidden md:grid justify-end">
                    {getStarted}
                </div>
            </div>
            
            {/* Simplified Mobile Menu - Initially hidden */}
            <div className="md:hidden">
                {calendar}
                {about}
            </div>
        </nav>

     );
}

export default Navbar;