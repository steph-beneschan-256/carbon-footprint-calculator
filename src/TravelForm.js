import logo from './logo.svg';
import './App.css';
import './TravelForm.css';
import LocationSearcher from './locationSearcher';
import { useEffect, useRef, useState } from 'react';
import formDataManager from './FormDataManager';
import distanceTools from './distanceTools';

const CO2_PER_MILE = 400; //g
//https://www.epa.gov/greenvehicles/tailpipe-greenhouse-gas-emissions-typical-passenger-vehicle#driving

// From the Myclimate API
const FUEL_TYPES = 
[
  {
    value: "gas",
    name: "Gas"
  },
  {
    value: "diesel",
    name: "Diesel"
  },
  {
    value: "hybrid",
    name: "Hybrid"
  },
  {
    value: "biogas",
    name: "Biogas"
  },
  {
    value: "naturalgas",
    name: "Natural Gas"
  },
  {
    value: "electric",
    name: "Electric"
  },
  {
    value: "biodiesel",
    name: "Biodiesel"
  },
  {
    value: "ethanol_10",
    name: "E10 (10% ethanol, 90% gasoline)"
  },
  {
    value: "ethanol_85",
    name: "E85 (85% ethanol, 15% gasoline)"
  },
  {
    value: "plug_in_hybrid",
    name: "Plug-In Hybrid"
  }
];

const CAR_TYPES = [
  {
    value: "small",
    name: "Small car"
  },
  {
    value: "midsize",
    name: "Midsize car"
  },
  {
    value: "luxury_suv_van",
    name: "Luxury car or SUV van"
  }
]

const ELECTRIC_LOCATION_TYPES = [
  {
    value: "ch",
    name: "CH"
  },
  {
    value: "de",
    name: "DE"
  },
  {
    value: "rest",
    name: "Rest"
  },
  {
    value: "certified_green",
    name: "Certified Green"
  },
  {
    value: "se",
    name: "SE"
  }
];

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
    const milesPerDay = parseFloat(travelData.baseDistance) + 
    travelData.routes.map((route) => parseFloat(route.distance) * parseFloat(route.daysPerWeek) / 7).reduce(
      (sum, d) => sum + d, 0
    );

    const fuelTypeID = travelData.fuelType ? FUEL_TYPES[travelData.fuelType].value : null;
    const carTypeID = travelData.carType ? CAR_TYPES[travelData.carType].value : null;
    const distanceInKM = milesPerDay * 1.60934;
    
    let inputParams = {
      car_type: carTypeID,
      fuel_type: fuelTypeID,
      km: distanceInKM
    };
    if((fuelTypeID === "electric") || (fuelTypeID === "plug_in_hybrid"))
      inputParams["electric_location"] = travelData.electricLocation;
    
    //TODO: it turns out that the myclimate API isn't free...
    // Might still want to do something with vehicle type data

    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: milesPerDay * CO2_PER_MILE,
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

  const [baseDistance, setBaseDistance] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [carType, setCarType] = useState(null);
  const [fuelType, setFuelType] = useState(null);
  const [electricLocation, setElectricLocation] = useState(null);

  // const [fuelType, setFuelType] = useState(null);

  // function syncData() {
  //   formDataManager.saveData(ACTIVITY_TYPE_KEY, {
  //     fuelType: fuelType
  //   })
  // }


  // For the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [selectedRouteOrigin, setSelectedRouteOrigin] = useState(null);
  const [selectedRouteDestination, setSelectedRouteDestination] = useState(null);

  const wasDataLoaded = useRef(false);

  function loadData() {
    const loadedData = formDataManager.loadData(ACTIVITY_TYPE_KEY);
    if(loadedData) {
      setBaseDistance(loadedData.baseDistance);
      setRoutes(loadedData.routes);
      setCarType(loadedData.carType);
      setFuelType(loadedData.fuelType);
      setElectricLocation(loadedData.electricLocation);
    }
  }

  async function saveData(keyToUpdate, newValue) {
    let newData = {
      baseDistance: baseDistance,
      routes: routes,
      carType: carType,
      fuelType: fuelType,
      electricLocation: electricLocation
    };
    newData[keyToUpdate] = newValue;
    formDataManager.saveData(ACTIVITY_TYPE_KEY, newData);
  }


    /*
    When the component is created, load the user's saved data if available,
    or intialize to a default value
    */
    useEffect(() => {
        if(!wasDataLoaded.current) {
            loadData();
            wasDataLoaded.current = true;
        }
    }, [wasDataLoaded]);

  function addRoute() {
    if(routes.length < 5) {
      setSelectedRoute(routes.length);
      setShowModal(true);
    }
  }

  function removeRoute(index) {
    if(routes.length > 0) {
      const newRoutes = [
        ...routes.slice(0, index),
        ...routes.slice(index+1)
      ];
      setRoutes(newRoutes);
      saveData("routes", newRoutes);
    }
  }

  function updateRouteData(index, newData) {
    const newRoutes = (index >= inputData.routes.length) ? inputData.routes.concat([newData])
    : inputData.routes.map((route, i) => (i !== index) ? route : newData);
    setRoutes(newRoutes);
    saveData("routes", newRoutes);
  }


  //TODO: Allow user to close modal by clicking outside of the modal window

  return (
    <div className="form-section">
      <div className="form-section-header">
        <img src="car.svg" alt="" />
        <h2>Car Travel</h2>
      </div>
      <div className="form-section-inner">
        <p>
            Regularly driving a car can dramatically inflate your carbon footprint. How many miles do you drive (using a gas-powered vehicle) per day?
        </p>
        <p>
          If you're not sure how many miles you drive per day, but you regularly drive on a certain route (e.g. from home to the grocery store) at least once per week, click "Add Route" below and we'll help you find the distance.
        </p>

        {
          <div>
            <label>
              <h3>Miles driven per day:</h3>
            
              <input type="number" min="0" value={baseDistance}
              onChange={(e) => {
                const newBaseDistance = e.target.value;
                setBaseDistance(newBaseDistance);
                saveData("baseDistance", newBaseDistance);
              }}
              />
            </label>
            <br />

            {routes.map((route, index) => (
                <div className="route-widget">
                  <b>{route.origin.address_line1}</b> to <b>{route.destination.address_line1}</b>:
                  <br/>
                  {route.distance.toFixed(2)} mi,
                  <input type="number" min={1} max={7}
                  value={route.daysPerWeek} onChange={(e) => {updateRouteData(index, {...route, daysPerWeek: e.target.value})}}/>
                  {parseInt(route.daysPerWeek) === 1 ? "day" : "days"} per week
                  <button onClick={e => removeRoute(index)}>
                    Remove route
                  </button>
                </div>
            ))}

            {(routes.length > 0) && <div>
              Total:<br/>
              = {(
                parseFloat(baseDistance) + 
                routes.map((route) => parseFloat(route.distance) * parseFloat(route.daysPerWeek) / 7).reduce(
                  (sum, d) => sum + d, 0.0
                )
              ).toFixed(2)} mi per day
            </div>}

            <button onClick={addRoute}>
                + Add Route
            </button>

            {/* <h3>Car Specifications:</h3>

            <p>
              Which of these best describes the type of fuel that your car uses?
            </p>
            <ul>
              {
                FUEL_TYPES.map((data, index) => (
                  <li>
                    <label>
                      <input type="radio" checked={fuelType === index}
                      value={data.value}
                      onChange={e => {
                        const selectedFuelType = index;
                        setFuelType(selectedFuelType);
                        saveData("fuelType", selectedFuelType);
                      }}/>
                      {data.name}
                    </label>
                  </li>
                ))
              }
            </ul>

            <p>
              Which of these best describes the size of your car?
            </p>

            <ul>
              {
                CAR_TYPES.map((data, index) => (
                  <li>
                    <label>
                      <input type="radio" checked={carType === index}
                      value={data.value}
                      onChange={e => {
                        const selectedCarType = index;
                        setCarType(selectedCarType);
                        saveData("carType", selectedCarType);
                      }}/>
                      {data.name}
                    </label>
                  </li>
                ))
              }
            </ul> */}


            {showModal && <div className="modal-container">
              {/* TODO: Allow user to close modal by clicking outside of the modal window */}
              <div className="modal-inner">
                  <h3 className="modal-header">Find Distance</h3>

                  <h4>From this location:</h4>
                  <LocationSearcher onResultSelected={(result) => {
                    setSelectedRouteOrigin(result);
                  }} />

                  {selectedRouteOrigin && <>{selectedRouteOrigin.address_line1} {selectedRouteOrigin.address_line2}</>}

                  <h4>To this location:</h4>
                  <LocationSearcher onResultSelected={(result) => {
                      setSelectedRouteDestination(result);
                  }} />

                  {selectedRouteDestination && <>{selectedRouteDestination.address_line1} {selectedRouteDestination.address_line2}</>}

                  <br/>

                  <button onClick={e => {
                    if(selectedRouteOrigin && selectedRouteDestination) {
                      const newDistance = distanceTools.getDistance(
                        parseFloat(selectedRouteOrigin.lat), parseFloat(selectedRouteOrigin.lon), 
                        parseFloat(selectedRouteDestination.lat), parseFloat(selectedRouteDestination.lon)
                      );
                      updateRouteData(selectedRoute, {
                        origin: selectedRouteOrigin,
                        destination: selectedRouteDestination,
                        distance: newDistance,
                        daysPerWeek: 1
                      });
                      setSelectedRouteOrigin(null);
                      setSelectedRouteDestination(null);
                      setShowModal(false);
                    }
                  }}>
                      Calculate Distance
                  </button>

                  <br/>

                  <button onClick={e => {
                    setSelectedRouteOrigin(null);
                    setSelectedRouteDestination(null);
                    setShowModal(false);
                  }}>
                    Cancel
                  </button>
              </div>
          </div>
          }   
          </div>
        }
      </div>
    </div>
  );
}

export default TravelForm;