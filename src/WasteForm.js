import { useEffect, useState } from "react";
import formDataManager from "./FormDataManager";

/*
notes:

https://www.epa.gov/sites/default/files/2021-01/documents/2018_ff_fact_sheet_dec_2020_fnl_508.pdf
page 14 has co2eq figures, but on a national level?

found another epa calculator:
https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator



*/

/*
A unique string associated with this type of activity,
used for synchronization with the FormDataManager object.
*/
const ACTIVITY_TYPE_KEY = "Waste";

/*
data from epa calculator, last updated 9/1/2014

avg. lbs co2-eq generated from waste per person per year:
total: 692
metal: 89.38
plastic: 35.56
glass: 25.39
newspaper: 113.14
magazines: 27.46
*/

/*

For different kinds of materials, specify the amount of GHG emissions
(in grams of CO2-eq) that an average US resident would save each day by recycling that material. 

Data comes from the EPA calculator, and was last updated in 2014:
https://www3.epa.gov/carbon-footprint-calculator/data/GHGCalculator.xls

TODO: find updated data, and data for food waste and yard waste
*/

const MATERIAL_WASTE_DATA = [
    {
        name: "metal",
        emissionsSaved: 111.074
    },
    {
        name: "plastic",
        emissionsSaved: 44.191
    },
    {
        name: "glass",
        emissionsSaved: 31.552
    },
    {
        name: "newspaper",
        emissionsSaved: 140.601
    },
    {
        name: "magazines",
        emissionsSaved: 34.125
    }
];

/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/
async function getFootprintData(userData) {
    let footprint = 0;
    let suggestions = [];

    console.log(userData);

    let mostSignificantMaterial = null;
    MATERIAL_WASTE_DATA.forEach((data, index) => {
        if(userData[index]) {
            footprint += data.emissionsSaved;
            if((mostSignificantMaterial === null) || (data.emissionsSaved > mostSignificantMaterial.emissionsSaved))
                mostSignificantMaterial = data;
        }
    })

    const suggestion = mostSignificantMaterial ? `If possible, recycling your ${mostSignificantMaterial.name} will help you save ${mostSignificantMaterial.emissionsSaved} CO2-eq per day.\n
    To find out how to recycle this item in your community, the EPA recommends https://earth911.com/recycling-center-search-guides/`
    : "";
    
    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: footprint,
        suggestions: [suggestion]
    }
}

function WasteForm({formRef, savedData}) {

    const checkedBoxes = savedData ? new Set(savedData.getAll("waste")) : new Set();

    return(
        <form ref={formRef}>
            <div className="form-section-header">
                <img src="waste.svg" alt="" />
                <h2>Waste/Recycling</h2>
            </div>
            <div className="form-section-inner">
                <p>
                    Some types of waste can be recycled, while other types of waste cannot be.
                </p>
                <p>
                    Which of the following materials do you regularly use, and regularly dispose of without recycling them?
                </p>

                <label>
                    <input type="checkbox" name="waste" value="metal"
                    defaultChecked={checkedBoxes.has("metal")}/>
                    Metal
                </label>
                <label>
                    <input type="checkbox" name="waste" value="plastic"
                    defaultChecked={checkedBoxes.has("plastic")}/>
                    Plastic
                </label>
                <label>
                    <input type="checkbox" name="waste" value="glass"
                    defaultChecked={checkedBoxes.has("glass")}/>
                    Glass
                </label>
                <label>
                    <input type="checkbox" name="waste" value="newspaper"
                    defaultChecked={checkedBoxes.has("newspaper")}/>
                    Newspaper
                </label>
                <label>
                    <input type="checkbox" name="waste" value="magazines"
                    defaultChecked={checkedBoxes.has("magazines")}/>
                    Magazines
                </label>
            </div>
        </form>
    )

}

// When ready, uncomment this line and replace "TemplateFormSection" with the name of the component function
export default WasteForm;