import logo from './logo.svg';
import './App.css';
import LocationSearcher from './locationSearcher';
import { useRef, useState } from 'react';
import RouteWidget from './RouteWidget';
import TravelForm from './TravelForm';
import formDataManager from './FormDataManager';
import FoodForm from './FoodForm';

import Chart from "react-apexcharts";

const CO2_PER_MILE = 400; //g
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

function App() {

  //Whether to show the results page, as opposed to the input form
  const [showResults, setShowResults] = useState(false);
  const totalFootprintData = useRef(0);

  const [suggestions, setSuggestions] = useState([]);

  // For chart rendering
  const [chartLabels, setChartLabels] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);

  async function calculateFootPrint() {

    const footprintData = await formDataManager.calculateTotalFootprint();
    totalFootprintData.current = footprintData;

    const categories = Object.keys(footprintData.breakdown);
    setChartLabels(categories);
    setChartSeries(categories.map((category) => footprintData.breakdown[category].footprint));

    setShowResults(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <div className="App-body">


        {!showResults ? (
          <>
          {/* The form */}
            {/* Travel section */}

            <TravelForm />
            <FoodForm />

            <button onClick={calculateFootPrint}>
              Calculate total footprint!
            </button>

          </>
        ) : (
          <>
            <h2>Your total carbon footprint:</h2>
            <h1>{totalFootprintData.current.total} grams CO₂e</h1>
            <p>
            CO₂e is short for CO₂e equivalent. Your footprint is equivalent to emitting about {totalFootprintData.current.total} grams of CO₂.
            {/* 
              This is correct, right?
              I referenced this:
              https://www.myclimate.org/information/faq/faq-detail/what-are-co2-equivalents/
            */}
            </p>
            <h3>
              Breakdown:
            </h3>
            <div className="footprint-chart-container">
              <Chart
                type="donut"
                options={{"labels": chartLabels}}
                series={chartSeries}
              />
            </div>
            <h3>Suggestions to reduce your carbon footprint:</h3>
            {
              suggestions.map((suggestion, index) => (
                <p>
                  {index+1}. {suggestion}
                </p>
              ))
            }
            <button onClick={e => setShowResults(false)}>
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
