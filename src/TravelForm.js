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
    let travelFootprint = 0;
    travelData.forEach((data) => {
        //TODO: query the api that shivangi found
        travelFootprint += CO2_PER_MILE * parseFloat(data.distance);
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
            setInputData(savedData ? savedData : [
                {
                    distance: 0,
                    origin: null,
                    destination: null
                } // Default value
            ]);
        }
    }, [inputData]);

  function addRouteWidget() {
    if(inputData.length < 5) {
      const newIndex = inputData.length;
      setInputData([
        ...inputData,
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
    if(inputData.length > 1) {
      setInputData([
        ...inputData.splice(0, index),
        ...inputData.splice(index)
      ])
    }
  }

  return (
    <div className="form-section">
        <h2>Car Travel</h2>
        <p>
            Regularly driving a car can dramatically inflate your carbon footprint.
        </p>
        <p>
            If there's a route on which you regularly on which you regularly drive (using a gas-powered vehicle), such as from home to the workplace or from the workplace to the grocery store, please enter the distance that you drive on that route.
        </p>

        {inputData && (inputData.map((_, index) => (
            <RouteWidget routeNumber={index+1}
            defaultDistance={inputData[index].distance}
            defaultOrigin={inputData[index].origin}
            defaultDestination={inputData[index].destination}

            onDataUpdated={(newData) => {
            const newTravelData = (inputData.map((data, dataIndex) => {
                return (index !== dataIndex) ? data : newData;
            }));
            setInputData(newTravelData);
            console.log(newTravelData);
            // Use formDataManager.saveData to save the user's input data
            formDataManager.saveData(ACTIVITY_TYPE_KEY, newTravelData);
            }}
            />
        )))}

        <button onClick={addRouteWidget}>
            + Add Route
        </button>
        
    </div>
  );
}

export default TravelForm;