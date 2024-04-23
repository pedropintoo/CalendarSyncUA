function Filter() {
    return ( 
        // <!-- Main  -->
        <>
        <div className="border-solid bg-slate-200 border-2 border-sky-600 rounded">
            <div className="py-5 px-5 flex justify-center border-solid border-b-2 border-sky-600"> 
                <h1 className="">Filter</h1>
            </div>
            <div className="px-2"> 
                <h1 className=""></h1>
                <form>
                    <input type="checkbox" id="allTags" name="allTags" defaultChecked />
                    <label htmlFor="allTags"> Tags</label><br/>
                    <br/>
                    <input type="checkbox" id="tag1" name="tag1" defaultChecked />
                    <label htmlFor="tag1" style={{color:"rgb(153,0,0)"}}> BD</label><br/>
                    <input type="checkbox" id="tag2" name="tag2" defaultChecked />
                    <label htmlFor="tag1" style={{color:"rgb(0,102,51)"}}> C</label><br/>
                    <input type="checkbox" id="tag3" name="tag3" defaultChecked />
                    <label htmlFor="tag1" style={{color:"rgb(153,153,0)"}}> CD</label><br/>
                    <input type="checkbox" id="tag4" name="tag4" defaultChecked />
                    <label htmlFor="tag1" style={{color:"rgb(0,51,153)"}}> IHC</label><br/>
                    <input type="checkbox" id="tag5" name="tag5" defaultChecked />
                    <label htmlFor="tag1" style={{color:"rgb(153,102,0)"}}> PDS</label><br/>
                    <input type="checkbox" id="otherTags" name="otherTags" defaultChecked />
                    <label htmlFor="otherTags"> Others</label>
                </form>
            </div>
        </div>
        </>
     );
}

export default Filter;