
/*
For different kinds of materials, specify the amount of GHG emissions
(in grams of CO2-eq) that an average US resident would save each year by recycling that material. 

Data comes from the EPA calculator, and was last updated in 2014:
https://www3.epa.gov/carbon-footprint-calculator/data/GHGCalculator.xls
*/

const EMISSIONS_SAVED_PER_MATERIAL = {
    metal: 111.074*365,
    plastic:44.191*365,
    glass: 31.552*365,
    newspaper: 140.601*365,
    magazines: 34.125*365
};

function getWasteFootprintData(wasteForm) {
    let materialsSorted = wasteForm.getAll("waste");
    materialsSorted.sort((m1, m2) => EMISSIONS_SAVED_PER_MATERIAL[m2] - EMISSIONS_SAVED_PER_MATERIAL[m1]);

    let footprint = materialsSorted.reduce(
        (sum, material) => sum + EMISSIONS_SAVED_PER_MATERIAL[material],
        0
    );

    const mostSignificantMaterial = materialsSorted[0];
    let suggestions = [];
    if(mostSignificantMaterial) {
        suggestions.push({
            header: `Recycle your ${materialsSorted[0]}`,
            text: `Find out how to recycle ${materialsSorted[0]} in your community. If you recycle it regularly, you will likely reduce your footprint by ${EMISSIONS_SAVED_PER_MATERIAL[materialsSorted[0]]} kg per year.`,
            emissionsSaved: EMISSIONS_SAVED_PER_MATERIAL[materialsSorted[0]]
        })
    }

    return {
        key: "Material waste",
        footprint: footprint,
        suggestions: suggestions
    }
}

export default getWasteFootprintData;