import React from 'react';

interface ButtonProps {
    label: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <button
            className={`text-white font-bold py-2 px-4 m-1 rounded ${
                isHovered ? 'bg-sky-500' : 'bg-sky-600'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const HeaderButtons: React.FC = () => {
    const handleAddEvent = () => {
        console.log('Add Event');
    };

    const handleImport = () => {
        console.log('Import');
    };

    const handleExport = () => {
        console.log('Export');
    };

    return (
        <>
            <div className="flex border-solid border-b-2 border-sky-600 justify-between items-center px-4 py-2">
                <div>
                    <Button label="Add Event +" onClick={handleAddEvent}/>
                </div>
                <div>
                    <Button label="Import" onClick={handleImport}/>
                    <Button label="Export" onClick={handleExport}/>
                </div>
            </div>    
        </>
    );
}

function Calendar() {
    return (
        <>
            <div className="border-solid bg-slate-200 lg:col-span-4 rounded-lg border-2 border-sky-600 rounded">
                <HeaderButtons />
            </div>
        </>
    );
}

export default Calendar;