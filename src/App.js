import logo from './logo.svg';
import './App.css';
import { useRef, useState } from 'react';
import TravelForm from './travel/TravelForm';
import formDataManager from './FormDataManager';
import FoodForm from './food/FoodForm';

import Chart from "react-apexcharts";
import WasteForm from './waste/WasteForm';
import HomeEnergyForm from './HomeEnergyForm';
import getFoodFootprintData from './food/FoodDataHandler';
import getTravelFootprintData from './travel/TravelDataHandler';
import DistanceFinder from './DistanceFinder';
import getWasteFootprintData from './waste/WasteDataHandler';



function App() {

  //Whether to show the results page, as opposed to the input form
  const [showResults, setShowResults] = useState(false);
  const totalFootprintData = useRef(0);

  const [suggestions, setSuggestions] = useState([]);

  // For chart rendering
  const [chartLabels, setChartLabels] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);

  // References to the form objects
  const foodFormRef = useRef(null);
  const travelFormRef = useRef(null);
  const wasteFormRef = useRef(null);
  const homeEnergyFormRef = useRef(null);

  // Saved data
  const foodSavedData = useRef(null);
  const travelSavedData = useRef(null);
  const wasteSavedData = useRef(null);
  const homeEnergySavedData = useRef(null);

  // For Distance Helper utility
  const distanceFieldRef = useRef(null);
  const [showDistanceHelper, setShowDistanceHelper] = useState(false);

  async function calculateFootPrint() {
    const travelData = new FormData(travelFormRef.current);
    const foodData = new FormData(foodFormRef.current);
    const wasteData = new FormData(wasteFormRef.current);

    travelSavedData.current = travelData;
    foodSavedData.current = foodData;
    wasteSavedData.current = wasteData;
    //homeEnergyData.current = new FormData(homeEnergyFormRef.current);

    console.log(wasteSavedData.current);

    const footprintData = {
      breakdown: {
        "Food": getFoodFootprintData(foodData),
        "Travel": getTravelFootprintData(travelData),
        "Material Waste": getWasteFootprintData(wasteData)
      }
    };
    footprintData.total = Object.keys(footprintData.breakdown).reduce(
      (sum, key) => sum + footprintData.breakdown[key].footprint, 0
    );

    //const footprintData = await formDataManager.calculateTotalFootprint();
    totalFootprintData.current = footprintData;

    const categories = Object.keys(footprintData.breakdown);
    setChartLabels(categories);
    setChartSeries(categories.map((category) => footprintData.breakdown[category].footprint));


    let newSuggestions = [];
    categories.forEach((category) => {
        newSuggestions = newSuggestions.concat(footprintData.breakdown[category].suggestions);
    });

    // Sort suggestions in descending order of emissionsSaved
    newSuggestions.sort((s1, s2) =>
      s2.emissionsSaved - s1.emissionsSaved
    );
    setSuggestions(newSuggestions.slice(0,3));

    setShowResults(true);
  }

  //equivalencies from here: https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator#results

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src="factory horizontal.png" alt=""></img>
          <h1>
            Carbon Footprint Calculator
          </h1>
        </div>
        
        
      </header>

      <div className="App-body">


        {!showResults ? (
          <>
          {/* The form */}
            {/* Travel section */}

            <div style={{display: showResults ? "none" : "initial"}}>
              <TravelForm formRef={travelFormRef} savedData={travelSavedData.current}
              distanceRef={distanceFieldRef}
              openDistanceUtility={() => {
                setShowDistanceHelper(true);
              }}/>
              <FoodForm formRef={foodFormRef} savedData={foodSavedData.current}/>
              <WasteForm formRef={wasteFormRef} savedData={wasteSavedData.current} />
              {/* <HomeEnergyForm formRef={homeEnergyFormRef} savedData={homeEnergySavedData.current}/> */}
            </div>

            

            {showDistanceHelper && <DistanceFinder 
              onSave={(routes) => {
                let totalDistance = routes.reduce(
                  (sum, route) => sum + route.distance ? (route.distance * route.daysPerWeek) : 0,
                  0
                );
                distanceFieldRef.current.value = (totalDistance.toFixed(1));
                console.log(distanceFieldRef.current);
                setShowDistanceHelper(false);

              }}
              onCancel={() => setShowDistanceHelper(false)}
            />}

            <button onClick={calculateFootPrint} className="primary-button full-width-button">
              Calculate total footprint
            </button>

          </>
        ) : (
          <>
            <h2>Your total carbon footprint:</h2>
            <h1>{totalFootprintData.current.total.toLocaleString("en-US")} kg CO₂e per year</h1>
            <h2>What does this number look like?</h2>
            <p>
              Your footprint is roughly equivalent to the greenhouse gases emitted from:
            </p>
            <ul>
              <li>
                Burning
                <b>{' '+(1.1 * totalFootprintData.current.total).toLocaleString("en-US")+' '}</b>
                pounds of coal</li>
              <li>
                Consuming
                <b>{' '+(0.113 * totalFootprintData.current.total).toLocaleString("en-US")+' '}</b>
                gallons of gasoline
              </li>
              <li>
                The electricity used by
                <b>{' '+(0.0002 * totalFootprintData.current.total).toLocaleString("en-US")+' '}</b>
                homes over one year
              </li>
            </ul>

            <h3>
              Breakdown:
            </h3>
            <div className="footprint-chart-container">
              <Chart
                type="donut"
                options={{
                  "labels": chartLabels,
                  tooltip: {
                    y: {
                      formatter: (v,i) => parseFloat(v).toLocaleString("en-US") + " kg CO₂e"
                    }
                  }
                }}
                series={chartSeries}
              />
            </div>
            <h3>Suggestions to reduce your carbon footprint:</h3>
            <div className="suggestions-container">
            {
              suggestions.map((suggestion, index) => (
                <p>
                  <h4>{index+1}. {suggestion.header}</h4>
                  <p>{suggestion.text}</p>
                </p>
              ))
            }
            </div>

            <button onClick={e => setShowResults(false)}
            className="tertiary-button full-width-button">
              Edit your answers
            </button>
          </>
        )}

        <div>

        </div> 
        
      </div>
      <div className="App-footer">
          <h2>Assumptions and References</h2>
          <ul>
            <li>
              <p>
              For each vehicle type covered by the survey (gas-powered, electric, full hybrid, and plug-in hybrid), the amount of CO2 emitted by driving the vehicle one mile is derived from the formulas used for the U.S. Department of Energy's Electricity Sources and Fuel-Cycle Emissions Tool. For the formulas which require the average emissions of generated electricity, this program uses the 2020 national average as given by the U.S. Energy Information Administration (see Table 6):
              </p>
              <ul>
                <li>
                  <a href="https://afdc.energy.gov/vehicles/electric_emissions_sources.html" target="_blank" rel="noreferrer">
                    https://afdc.energy.gov/vehicles/electric_emissions_sources.html
                  </a>
                </li>
                <li>
                  <a href="https://www.eia.gov/environment/emissions/state/" target="_blank" rel="noreferrer">
                    https://www.eia.gov/environment/emissions/state/
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <p>
              Each year, the average American consumer discards about 20% of food waste according to the U.S. Department of Agriculture, and causes about 650kg of CO2e of emissions due to food waste according to the U.S. Environmental Protection Agency. The user's footprint due to food waste is therefore estimated at (x - 20%) * 650kg CO2e per year, where x is the percentage of food wasted by the user:
              </p>
              <ul>
                <li>
                <a href="https://www.ers.usda.gov/webdocs/publications/43833/43680_eib121.pdf?v=0" target="_blank" rel="noreferrer">
                  https://www.ers.usda.gov/webdocs/publications/43833/43680_eib121.pdf?v=0 
                </a>
                </li>
                <li>
                <a href="https://www.epa.gov/system/files/documents/2021-11/from-farm-to-kitchen-the-environmental-impacts-of-u.s.-food-waste_508-tagged.pdf" target="_blank" rel="noreferrer">
                  https://www.epa.gov/system/files/documents/2021-11/from-farm-to-kitchen-the-environmental-impacts-of-u.s.-food-waste_508-tagged.pdf 
                </a>
                </li>
              </ul>
            </li>
            <li>
              <p>
              If the user eats beef, other meat, eggs, and/or cheese on a given day, the user is assumed to eat exactly 100g of each. If the user drinks milk on a given day, the user is assumed to drink 1 cup. The CO2 emissions caused by producing one serving for each of these food categories is derived from the following source: 
              </p>
              <ul>
                <li>
                <a href="https://www.researchgate.net/publication/325532198_Reducing_food%27s_environmental_impacts_through_producers_and_consumers" target="_blank" rel="noreferrer">
                  https://www.researchgate.net/publication/325532198_Reducing_food%27s_environmental_impacts_through_producers_and_consumers 
                </a>
                </li>
              </ul>
            </li>
            <li>
              <p>
              For each type of recyclable material covered by the survey, the estimated emissions saved per year if the user recycles that material comes from the data used by the Environmental Protection Agency's own Carbon Footprint Calculator, last updated in 2014:
              </p>
              <ul>
                <li>
                <a href="https://www3.epa.gov/carbon-footprint-calculator/" target="_blank" rel="noreferrer">
                https://www3.epa.gov/carbon-footprint-calculator/
                </a>
                </li>
              </ul>
            </li>
            <li>
              <p>
              1 kg of CO2-e is assumed equal to the emissions produced by burning x lbs of coal, consuming y gallons of gasoline, or the energy used by z homes over a given year. This data comes from the Environmental Protection Agency's Greenhouse Gas Equivalencies Calculator:
              </p>
              <ul>
                <li>
                <a href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator" target="_blank" rel="noreferrer">
                  https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
                </a>
                
                </li>
              </ul>
            </li>
          </ul>

      </div>
    </div>
  );
}

export default App;
