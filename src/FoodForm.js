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
  const servingsPerWeek = parseInt(userData.totalServingsPerWeek);
  const foodFootprint = parseInt(userData.totalServingsPerWeek) / 7 * FOOD_DATA[userData.meatMostEaten].co2PerServing;
  let suggestions = [];
  if(servingsPerWeek > 0) {
    switch(FOOD_DATA[userData.meatMostEaten].name) {
      case "beef":
      case "lamb":
        suggestions.push("Producing beef and lamb involves much more greenhouse gas emissions than producing other kinds of meat. Consider occasionally swapping beef or lamb for a different type of meat; switching to pork, for instance, carries a carbon footprint 80% smaller than that of beef.");
        break;
      default:
        break;
    }

    if(servingsPerWeek > 7) {
      suggestions.push("You seem to eat meat rather often. You don't have to become a vegetarian, but consider eating a larger portion of vegetables.")
    };

  }
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
                {
                  totalServingsPerWeek: 0,
                  meatMostEaten: 0
                }
                //Default value
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
            Some foods require more greenhouse gas emissions to produce than others.
            </p>
            <h3>
              Meat
            </h3>
            Roughly how many servings of meat do you consume each week?
            <br/>
            (One serving is approximately 3oz, or about the size of a deck of playing cards)
            {inputData && <div>
              <input type="number" min={0}
              value={inputData.totalServingsPerWeek} onChange={ e => {
                const newFoodData = {
                  ...inputData,
                  totalServingsPerWeek: e.target.value
                };
                setInputData(newFoodData);
                formDataManager.saveData(ACTIVITY_TYPE_KEY, newFoodData);
              }}/>
            </div>}
            {inputData && (parseInt(inputData.totalServingsPerWeek) > 0) && <div>
              <p>
                What type of meat do you consume most often?
              </p>
              {FOOD_DATA.map((data, index) => (
                <label>
                  <input type="radio" checked={inputData.meatMostEaten === index}
                  value={data.name}
                  onChange={e => {
                    const newFoodData = {
                      ...inputData,
                      meatMostEaten: index
                    };
                    setInputData(newFoodData);
                    formDataManager.saveData(ACTIVITY_TYPE_KEY, newFoodData);
                  }}/>
                  {data.name}
                </label>
              ))}
            </div>}
        </div>
      </div>
    )

}

export default FoodForm;