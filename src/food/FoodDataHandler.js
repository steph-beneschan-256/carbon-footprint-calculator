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
    const wasteFootprint = 650000 * foodForm.get("uneatenFoodPortion");

    return {
        key: "Food",
        footprint: dailyFootprint * 365 + wasteFootprint,
        suggestions: ["placeholder"]
    }
}

export default getFoodFootprintData;