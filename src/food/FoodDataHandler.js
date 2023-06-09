/*
Parse data from the form from the FoodForm component
*/

const EMISSIONS_PER_SERVING = {
    beef: 50.0,
    nonBeefMeat: 6.0, //rough average
    eggs: 4.2,
    cheese: 11.0,
    milk: 3.2 / 4.22675 //convert from per-liter to per-cup
}

function getFoodFootprintData(foodForm) {
    let dailyFootprint = 0.0; // grams of CO2-equivalent
    
    // Assume 1 serving per day
    Object.keys(EMISSIONS_PER_SERVING).forEach((key) => {
        dailyFootprint += parseFloat(foodForm.get(key)) / 7.0 * EMISSIONS_PER_SERVING[key];
    });

    // Assume average of 650 kg (650000 g) of CO2e per person emitted each year due to food production
    // https://www.ers.usda.gov/webdocs/publications/43833/43680_eib121.pdf?v=0 
    const portionWasted = foodForm.get("uneatenFoodPortion");
    const wasteFootprint = 650 * portionWasted;

    let suggestions = [];
    suggestions.push({
        header: "Plan grocery shopping and meals",
        text: `${(portionWasted > 0.2) ? "You seem to throw out more of the food you buy than the average American." : ""} By reducing the amount of food that you buy, you can reduce the amount of food that you waste. One way to accomplish this is to create shopping lists and meal plans, to help make sure that you only buy as much as you need to. If you reduce your food waste by 50%, you will reduce your footprint by about ${(wasteFootprint * 0.5).toLocaleString("en-US")} kg of CO2-e per year.`,
        emissionsSaved: wasteFootprint
    });

    if(parseInt(foodForm.get("beef")) > Math.min(parseInt(foodForm.get("nonBeefMeat")), 3)) {
        const saved = parseInt(foodForm.get("beef")) * (EMISSIONS_PER_SERVING.beef - EMISSIONS_PER_SERVING.nonBeefMeat); 
        suggestions.push({
            header: "Swap out beef for other meats",
            text: `Beef production involves dramatically higher greenhouse gas emissions than the production of chicken, pork, or other kinds of meat. By replacing beef with another kind of meat, you can save roughly ${saved.toLocaleString("en-US")} kg CO2-e per year.`,
            emissionsSaved: saved
        })
    }

    return {
        key: "Food",
        footprint: dailyFootprint * 365 + wasteFootprint,
        suggestions: suggestions
    }
}

export default getFoodFootprintData;