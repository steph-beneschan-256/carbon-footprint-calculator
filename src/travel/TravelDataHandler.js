/*
Parse data from the form from the FoodForm component
*/


const AVG_CO2_PER_MILE_ELECTRIC= 168.9010109 / 0.38 //in grams
/* 

Source of average CO2 per mile for gas-powered vehicle:
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

Source of average CO2 emitted per kWh across US:
https://www.eia.gov/environment/emissions/state/excel/table6.xlsx



(0.29 + 0.35 + 0.50)/3 = 1.14/3 = 0.38 kwH/mile

Source of average kWh per mile for different car types:
https://afdc.energy.gov/vehicles/electric_emissions_sources.html
fully-electric: 3.60 mi/kWh
plug-in electric: 3.03 mi/kWh
hybrid: ???????

Assuming 1 BTU = 293.07107 kWh

Using energy.gov data for consistency

1 million btu = 293.07107 kWh
49.454 kg carbon dioxide per 1 million btu i.e. per 293.07107 kWh
0.169 kg (=0.3726 lbs) per kWh 
1 / 3.60 kWh used per mile for a fully-electric car

*/

// in lbs
const CO2_PER_MILE = {
    gas: 23.7 / 21.79,
    electric: 0.3726 / 3.60,
    plugInHybrid: 56.3 / 100 / 3.03 * 0.3724 + 43.7 / 100 / 40.80 * 23.7,
    hybrid: 23.7 / 39.78

};

function getSuggestions(footprint, carType) {
    switch(carType) {
        case "gas":
            return [
                {
                    header: "Switch to a hybrid or electric vehicle",
                    text: `Contrary to popular belief, electric and hybrid vehicles tend to be less expensive than gas-powered vehicles throughout their lifetime, due to differences in fuel and maintenance costs.\nFurthermore, using a more fuel-efficient vehicle can dramatically reduce your footprint. By switching to a plug-in hybrid vehicle, you will reduce your emissions by roughly ${((CO2_PER_MILE.plugInHybrid / CO2_PER_MILE.gas) * footprint).toLocaleString("en-US")} kg per year.`,
                    emissionsSaved: (CO2_PER_MILE.plugInHybrid / CO2_PER_MILE.gas) * footprint
                }
            ]
        case "hybrid":
            return [
                {
                    header: "Switch to a plug-in hybrid or electric vehicle",
                    text: `Generally, a plug-in hybrid vehicle will use electricity instead of gas whenever the battery has power, whereas a "full hybrid" vehicle always uses gas when traveling at higher speeds. By switching to a plug-in hybrid, you will reduce your emissions by roughly ${(CO2_PER_MILE.plugInHybrid / CO2_PER_MILE.hybrid * footprint).toLocaleString("en-US")} kg per year.`,
                    emissionsSaved: CO2_PER_MILE.plugInHybrid / CO2_PER_MILE.hybrid * footprint
                }
            ]
        default:
            return [
                {
                    header: "Consider walking or biking once per week",
                    text: `While driving an electric or plug-in hybrid car is much more efficient for the environment than a gas-powered car, these cars still carry a footprint since the electricity needed to charge them usually comes (in part) from fossil fuels. If possible, switch to walking or biking in order to eliminate this footprint altogether. If you choose to walk or bike for 1/7 miles you currently drive, you will reduce your emissions by ${(footprint/7).toLocaleString("en-US")} kg per year.`,
                    emissionsSaved: footprint/7
                }
            ]
    }
}

function getTravelFootprintData(travelForm) {
    let dailyFootprint = 0.0; // grams of CO2-equivalent

    const carType = travelForm.get("carType");
    const userCO2perMile = CO2_PER_MILE[carType] * 0.459392 //convert to kg;

    dailyFootprint += travelForm.get("milesPerDay") * userCO2perMile;
    
    const footprint = dailyFootprint * 365;

    return {
        key: "Travel",
        footprint: footprint,
        suggestions: getSuggestions(footprint, carType)
    }
}

export default getTravelFootprintData;