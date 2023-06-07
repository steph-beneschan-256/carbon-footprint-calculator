import logo from './logo.svg';
import './App.css';
import LocationSearcher from './locationSearcher';
import { useRef, useState } from 'react';
import RouteWidget from './RouteWidget';
import TravelForm from './TravelForm';
import formDataManager from './FormDataManager';
import FoodForm from './FoodForm';

const CO2_PER_MILE = 400; //g
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

function App() {

  //Whether to show the results page, as opposed to the input form
  const [showResults, setShowResults] = useState(false);
  const totalFootprint = useRef(0);

  const [suggestions, setSuggestions] = useState([]);

  async function calculateFootPrint() {

    const footprintData = await formDataManager.calculateTotalFootprint();
    totalFootprint.current = footprintData.total;

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
            <p>{totalFootprint.current}</p>
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
