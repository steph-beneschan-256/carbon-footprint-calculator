import { useEffect, useState } from "react";
import formDataManager from "./FormDataManager";

/*
A unique string associated with this type of activity,
used for synchronization with the FormDataManager object.
*/
const ACTIVITY_TYPE_KEY = "";



/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/
async function getFootprintData(userData) {
    let footprint = 0;
    let suggestions = [];

    /*
    Add code here to calculate the data
    */
    
    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: footprint,
        suggestions: suggestions
    }
}

/*
Register the getFootprintData function for this activity type/section form
This should make it easier for our application to accumulate all the data at once
*/
formDataManager.addActivityType(ACTIVITY_TYPE_KEY, getFootprintData);

function TemplateFormSection() {

    // Data that the user has input for this activity type
    const [inputData, setInputData] = useState(null);

    /*
    When the component is created, load the user's saved data if available,
    or intialize to a default value
    */
    useEffect(() => {
        if(!inputData) {
            let savedData = formDataManager.loadData(ACTIVITY_TYPE_KEY);
            setInputData(savedData ? savedData : 
                {} //Default value; replace with appropriate default value for this component
            );
        }
      }, [inputData]);
    

    return(
        <div>
            <h2>(Activity Type)</h2>
            <p>
            (Blah blah blah)
            </p>
            {inputData.map((data, index) => (
            <div>
                {/*
                    Input components/elements go here
                    When the user updates/inputs data,
                    call formDataManager.saveData(ACTIVITY_TYPE_KEY, newData),
                    where newData is the appropriate value for this component.
                
                */}
            </div>
            ))}
        </div>
    )

}

// When ready, uncomment this line and replace "TemplateFormSection" with the name of the component function
//export default TemplateFormSection;