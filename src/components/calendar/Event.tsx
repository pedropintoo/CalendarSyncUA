function Event({handleEvent, color, name}: {handleEvent: () => void, color: string, name: string}){
    return (
        <div 
        className={`${color} text-white p-2 rounded-lg m-1 cursor-pointer`}
        onClick={handleEvent}>
            <h1>{name}</h1>
        </div>
    );
}

export default Event;