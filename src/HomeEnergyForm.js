import './App.css';
// import './TravelForm.css';
import { useEffect, useRef, useState } from 'react';
import formDataManager from './FormDataManager';

const HEATING_TYPES = [
    {
        name: "Natural Gas",
        co2PerDollar: 119.58 / 10.68
    },
    {
        name: "Electricity",
        co2PerDollar: 1238516 / 943 / 0.1188
    },
    {
        name: "Fuel Oil",
        co2PerDollar: 22.61 / 4.02
    },
    {
        name: "Propane",
        co2PerDollar: 12.43 / 2.47
    }
];

/*
A unique string associated with this type of activity,
used for synchronization with the FormDataManager object.
*/
const ACTIVITY_TYPE_KEY = "Home Energy";

/*
Get the user's total footprint for this type of activity,
and suggestions for reducing their footprint
*/
async function getFootprintData(energyData) {
    const heatingType = HEATING_TYPES[energyData.primaryHeatingType];

    return {
        key: ACTIVITY_TYPE_KEY,
        footprint: heatingType.co2PerDollar * energyData.spendingPerMonth,
        suggestions: ["placeholder"]
    };
}

/*
Register the getFootprintData function for this activity type/section form
This should make it easier for our application to accumulate all the data at once
*/
formDataManager.addActivityType(ACTIVITY_TYPE_KEY, getFootprintData);



function HomeEnergyForm() {

  const [primaryHeatingType, setPrimaryHeatingType] = useState(null);
  const [spendingPerMonth, setSpendingPerMonth] = useState(null);

  const wasDataLoaded = useRef(false);

  function loadData() {
    const loadedData = formDataManager.loadData(ACTIVITY_TYPE_KEY);
    if(loadedData) {
      setPrimaryHeatingType(loadedData.primaryHeatingType);
      setSpendingPerMonth(loadedData.spendingPerMonth);
    }
  }

  async function saveData(keyToUpdate, newValue) {
    let newData = {
        primaryHeatingType: primaryHeatingType,
        spendingPerMonth: spendingPerMonth
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

  //TODO: Allow user to close modal by clicking outside of the modal window

  return (
    <div className="form-section">
      <div className="form-section-header">
        <img src="home.svg" alt="" />
        <h2>Home Energy</h2>
      </div>
      <div className="form-section-inner">
        <p>
            
        </p>
        <p>
          What is the primary source of heating in your home?
        </p>
        <ul>
            {
            HEATING_TYPES.map((data, index) => (
                <li>
                <label>
                    <input type="radio" checked={primaryHeatingType === index}
                    value={data.value}
                    onChange={e => {
                    const selectedFuelType = index;
                    setPrimaryHeatingType(selectedFuelType);
                    saveData("fuelType", selectedFuelType);
                    }}/>
                    {data.name}
                </label>
                </li>
            ))
            }
        </ul>
        <label>
            About how many dollars per month do you usually spend on energy?
            <input type="number" min="0" value={spendingPerMonth}
              onChange={(e) => {
                const newSpending = e.target.value;
                setSpendingPerMonth(newSpending);
                saveData("baseDistance", newSpending);
              }}
              />
        </label>
      </div>
    </div>
  );
}

export default HomeEnergyForm;