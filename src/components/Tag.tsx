function Tag({name, color}: {name:string, color:string}){
    return (
        <>
            <div 
            className={`${color} p-2 rounded-lg m-1 cursor-pointer`}>
                <h1>{name}</h1>
            </div>
        </>
    )
}