import { useEffect, useState } from "react";
import formDataManager from "./FormDataManager";

/*
A unique string associated with this type of activity,
used for synchronization with the FormDataManager object.
*/
const ACTIVITY_TYPE_KEY = "FOOD";

/*
Data for different kinds of food, and how much CO2-eq (in kg) is emitted from producing one serving of that food.
*/
const FOOD_DATA = [
    {
      name: "beef",
      co2PerServing: 50
    },
    {
      name: "lamb",
      co2PerServing: 20
    },
    {
      name: "pork",
      co2PerServing: 7.6
    },
    {
      name: "chicken",
      co2PerServing: 5.7
    },
    {
      name: "fish",
      co2PerServing: 6
    }
];

/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/
async function getFootprintData(userData) {
    let foodFootprint = 0;
    let suggestions = [];

    FOOD_DATA.forEach((data, index) => {
      foodFootprint += data.co2PerServing * parseInt(userData[index]);
    });

    //if the user only eats beef or lamb once per week, should cutting back on beef/lamb be our first suggestion here?
    //maybe check against the average amount of meat eaten per week?
    
    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: foodFootprint,
        suggestions: suggestions
    }
}

/*
Register the getFootprintData function for this activity type/section form
This should make it easier for our application to accumulate all the data at once
*/
formDataManager.addActivityType(ACTIVITY_TYPE_KEY, getFootprintData);

function FoodForm() {

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
                Array(FOOD_DATA.length).fill(0) //Default value
            );
        }
      }, [inputData]);
    

    return(
        <div>
          <div className="form-section-header">
            <img src="food.svg" alt="" />
            <h2>Food</h2>
          </div>
          <div className="form-section-inner">
            <p>
            Some foods require more greenhouse gas emissions to produce than others. If you eat one of the listed foods, please indicate how many servings of it you eat per week.
            </p>
            {inputData && inputData.map((data, index) => (
            <div>
                <b>{FOOD_DATA[index].name}:</b>
                <input type="number" min={0}
                value={inputData[index]} onChange={ e => {
                    const newFoodData = inputData.map((d,i) => {
                    return (i !== index) ? d : e.target.value
                    });
                    setInputData(newFoodData);
                    // Use formDataManager.saveData to save the user's input data
                    formDataManager.saveData(ACTIVITY_TYPE_KEY, newFoodData);
                }}
                />
            </div>
            ))}
        </div>
      </div>
    )

}

export default FoodForm;