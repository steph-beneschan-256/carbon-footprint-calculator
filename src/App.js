import logo from './logo.svg';
import './App.css';
import { useRef, useState } from 'react';
import TravelForm from './travel/TravelForm';
import formDataManager from './FormDataManager';
import FoodForm from './food/FoodForm';

import Chart from "react-apexcharts";
import WasteForm from './WasteForm';
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
        food: getFoodFootprintData(foodData),
        travel: getTravelFootprintData(travelData),
        waste: getWasteFootprintData(wasteData)
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
              Back to form
            </button>
          </>
        )}

        <div>

        </div>
        
      </div>
    </div>
  );
}

export default App;
