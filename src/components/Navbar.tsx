function Navbar() {
    return ( 
        // <!-- Navbar -->
        <nav className="bg-white border-gray-200 px-4 py-2">
            <div className="max-w-screen-xl mx-auto flex items-center">
                {/* Brand/Logo Area */}
                <a href="#" className="text-2xl font-semibold flex-1">CalendarSync UA</a>
                
                {/* Menu for larger screens, moved towards the left */}
                <div className="hidden md:flex justify-start items-center space-x-4 flex-1">
                <a href="#" className="text-blue-700 hover:text-blue-900">Calendar</a>
                <a href="#" className="text-gray-900 hover:text-blue-700">About</a>
                </div>
                
                {/* Get Started Button - Adjusted to be on the far right */}
                <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Get started</a>
            </div>
            
            {/* Simplified Mobile Menu - Initially hidden */}
            <div className="md:hidden">
                <a href="#" className="block text-blue-700 hover:text-blue-900">Calendar</a>
                <a href="#" className="block text-gray-900 hover:text-blue-700">About</a>
            </div>
        </nav>

     );
}

export default Navbar;