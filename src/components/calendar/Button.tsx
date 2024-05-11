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
            className={`text-white font-bold py-2 px-4 m-1 rounded ${isHovered ? 'bg-sky-500' : 'bg-sky-600'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;