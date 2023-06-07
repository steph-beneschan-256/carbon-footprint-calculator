import logo from './logo.svg';
import './App.css';
import LocationSearcher from './locationSearcher';
import { useRef, useState } from 'react';
import RouteWidget from './RouteWidget';

const CO2_PER_MILE = 400; //g
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

// using placeholder numbers

/*
Data for different kinds of food, and how much CO2-eq (in kg) is emitted from producing one serving of that food.
*/
const FOOD_DATA = [
  {
    name: "beef",
    co2PerServing: 50
  },
  {
    name: "lamb",
    co2PerServing: 20
  },
  {
    name: "pork",
    co2PerServing: 7.6
  },
  {
    name: "chicken",
    co2PerServing: 5.7
  },
  {
    name: "fish",
    co2PerServing: 6
  }
]

function App() {

  //Input data from the Travel section
  const [travelData, setTravelData] = useState(
    [
      {
        distance: 0,
        origin: null,
        destination: null
      }
    ]
  );

  //Input data from the Food section
  const [foodData, setFoodData] = useState(
    Array(FOOD_DATA.length).fill(0)
  );

  //Whether to show the results page, as opposed to the input form
  const [showResults, setShowResults] = useState(false);
  const totalFootprint = useRef(0);

  const [suggestions, setSuggestions] = useState([]);

  function calculateFootPrint() {
    let carTravelFootprint = 0;
    travelData.forEach((data) => {
      carTravelFootprint += CO2_PER_MILE * data.distance;
    })

    let foodFoodprint = 0;
    FOOD_DATA.forEach((data, index) => {
      foodFoodprint += data.co2PerServing * foodData[index];
    });

    totalFootprint.current = (carTravelFootprint + foodFoodprint);

    let newSuggestions = [];
    if((foodData[0] > 0) || (foodData[1] > 0))
      newSuggestions.push("Eat less beef and lamb");
    if(carTravelFootprint > 10*CO2_PER_MILE)
      newSuggestions.push("Consider alternate means of transport")

    setShowResults(true);
  }


  function addRouteWidget() {
    if(travelData.length < 5) {
      const newIndex = travelData.length;
      setTravelData([
        ...travelData,
        {
          key: newIndex,
          distance: 0,
          origin: null,
          destination: null
        }
      ])
    }
  }

  function deleteRouteWidget(index) {
    if(travelData.length > 1) {
      setTravelData([
        ...travelData.splice(0, index),
        ...travelData.splice(index)
      ])
    }
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
            <h2>Car Travel</h2>
            <p>
              Regularly driving a car can dramatically inflate your carbon footprint.
            </p>
            <p>
              If there's a route on which you regularly on which you regularly drive (using a gas-powered vehicle), such as from home to the workplace or from the workplace to the grocery store, please enter the distance that you drive on that route.
            </p>

            {travelData.map((_, index) => (
              <RouteWidget routeNumber={index+1}
              defaultDistance={travelData[index].distance}
              defaultOrigin={travelData[index].origin}
              defaultDestination={travelData[index].destination}

              onDataUpdated={(newData) => {
                setTravelData((travelData.map((data, dataIndex) => {
                  return (index !== dataIndex) ? data : newData;
              })));
              }}
              />
            ))}

            <button onClick={addRouteWidget}>
              + Add Route
            </button>

            <h2>Food</h2>
            <p>
              Some foods require more greenhouse gas emissions to produce than others. If you eat one of the listed foods, please indicate how many servings of it you eat per week.
            </p>
            {foodData.map((data, index) => (
              <div>
                <b>{FOOD_DATA[index].name}:</b>
                <input type="number" min={0}
                value={foodData[index]} onChange={ e =>
                  setFoodData(foodData.map((d,i) => {
                    return (i !== index) ? d : e.target.value
                  }))}
                />
              </div>
            ))}
            
            <button onClick={calculateFootPrint}>
              calculate total footprint
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
