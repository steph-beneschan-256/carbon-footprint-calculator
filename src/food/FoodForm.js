
/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/

/*
Register the getFootprintData function for this activity type/section form
This should make it easier for our application to accumulate all the data at once
*/


function FoodForm({formRef, savedData}) {

    function getDefault(key, trueDefault) {
      return savedData ? savedData.get(key) : trueDefault;
    }

    return(
      <form ref={formRef}>
        <div className="form-section-header">
          <img src="food.svg" alt=""/>
          <h2>Food</h2>
        </div>
        <div className="form-section-inner">
          <p>
             
          </p>

          <h3>Diet</h3>
          <p>Some kinds of food require more resources to produce than others. On how many days per week do you eat each of the following?</p>
          <label>
            <span>Beef:</span>
            <input type="number" name="beef"
            min={0} max={7} defaultValue={getDefault("beef", 0)}/>
          </label>
          <label>
          <span>Meat (excluding beef):</span>
            <input type="number" name="nonBeefMeat"
            min={0} max={7} defaultValue={getDefault("nonBeefMeat", 0)}/>
          </label>
          <label>
          <span>Eggs:</span>
            <input type="number" name="eggs"
            min={0} max={7} defaultValue={getDefault("eggs", 0)}/>
          </label>
          <label>
          <span>Cheese:</span>
            <input type="number" name="cheese"
            min={0} max={7} defaultValue={getDefault("cheese", 0)}/>
          </label>
          <label>
          <span>Milk (from cows):</span>
            <input type="number" name="milk"
            min={0} max={7} defaultValue={getDefault("milk", 0)}/>
          </label>
          {/* <label>
            Grains:
            <input type="number" name="grainDaysPerWeek" min={0} max={7}/>
          </label>
          <label>
            Fruits and/or Vegetables:
            <input type="number" name="fruitVegDaysPerWeek" min={0} max={7}/>
          </label> */}

          <h3>Uneaten Food</h3>
          <p>Uneaten food, whether composted or sent to landfills, emits methane into the atmosphere. Of the food you buy, roughly how much do you end up throwing away (e.g. because it has expired)?</p>
          <label>
          <span>Uneaten food:</span>
            <input type="range" name="uneatenFoodPortion"
            min={0} max={1} step={0.1}
            defaultValue={getDefault("uneatenFoodPortion", 0.2)}/> 
          </label>
        </div>
      </form>
    )
}

export default FoodForm;