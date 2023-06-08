import logo from './logo.svg';
import './App.css';
import LocationSearcher from './locationSearcher';
import { useEffect, useRef, useState } from 'react';
import RouteWidget from './RouteWidget';
import formDataManager from './FormDataManager';

const CO2_PER_MILE = 400; //g
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

/*
A unique string associated with this type of activity,
used for synchronization with the FormDataManager object.
*/
const ACTIVITY_TYPE_KEY = "TRAVEL";

/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/
async function getFootprintData(travelData) {
    let travelFootprint = travelData.baseDistance;
    travelData.routes.forEach((route) => {
        //TODO: query the api that shivangi found
        travelFootprint += CO2_PER_MILE * parseFloat(route.distance) * route.daysPerWeek / 7;
    });
    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: travelFootprint,
        suggestions: ["placeholder"]
    };
}

/*
Register the getFootprintData function for this activity type/section form
This should make it easier for our application to accumulate all the data at once
*/
formDataManager.addActivityType(ACTIVITY_TYPE_KEY, getFootprintData);

function TravelForm() {

  // Data that the user has input for this activity type
  const [inputData, setInputData] = useState(null);

    /*
    When the component is created, load the user's saved data if available,
    or intialize to a default value
    */
    useEffect(() => {
        if(!inputData) {
            let savedData = formDataManager.loadData(ACTIVITY_TYPE_KEY);
            setInputData(savedData ? savedData : {
              baseDistance: 0,
              routes: [
                // {
                //     distance: 0,
                //     origin: null,
                //     destination: null,
                //     daysPerWeek: 1
                // } // Default value
            ]});
        }
    }, [inputData]);

  function addRoute() {
    if(inputData.routes.length < 5) {
      const newIndex = inputData.routes.length;
      setInputData({
        baseDistance: (inputData.baseDistance),
        routes: [
          ...inputData.routes,
          {
            key: newIndex,
            distance: 0,
            origin: null,
            destination: null,
            daysPerWeek: 1
          }
        ]
      });
    }
  }

  function removeRoute(index) {
    if(inputData.routes.length > 1) {
      setInputData({
        baseDistance: (inputData.baseDistance),
        routes: [
          ...inputData.routes.slice(0, index),
          ...inputData.routes.slice(index)
        ]
      });
    }
  }

  return (
    <div className="form-section">
      <div className="form-section-header">
        <img src="car.svg" alt="" />
        <h2>Car Travel</h2>
      </div>
      <div className="form-section-inner">
        <p>
            Regularly driving a car can dramatically inflate your carbon footprint.
        </p>
        <p>
            If there's a route on which you regularly on which you regularly drive (using a gas-powered vehicle), such as from home to the workplace or from the workplace to the grocery store, please enter the distance that you drive on that route.
        </p>

        {
          inputData && <div>
            <input type="number" min="0" value={inputData.baseDistance}
            onChange={(e) => {
              const newTravelData = {
                ...inputData,
                baseDistance: e.target.value
              };
              setInputData(newTravelData);
              formDataManager.saveData(ACTIVITY_TYPE_KEY, newTravelData);
            }}
            />

            {/* 

            Shouldn't spend too much time on the route input thing, but it maybe should go something like this:
            1. click add route button
            2. modal dialog appears
            3. route appears with its distance, in the list, and can be removed but not otherwise changed
            
            
            */}

            {inputData.routes.map((_, index) => (
                <RouteWidget routeNumber={index+1}
                defaultDistance={inputData.routes[index].distance}
                defaultOrigin={inputData.routes[index].origin}
                defaultDestination={inputData.routes[index].destination}

                onDataUpdated={(newData) => {
                  const newRoutes = (inputData.routes.map((data, dataIndex) => {
                      return (index !== dataIndex) ? data : newData;
                  }));
                  const newTravelData = {
                    ...inputData,
                    routes: newRoutes
                  };
                  setInputData(newTravelData);
                  // Use formDataManager.saveData to save the user's input data
                  formDataManager.saveData(ACTIVITY_TYPE_KEY, newTravelData);
                  }}
                />
            ))}

            <button onClick={addRoute}>
                + Add Route
            </button>
            
          </div>
        }

      </div>

      
        
    </div>
  );
}

export default TravelForm;