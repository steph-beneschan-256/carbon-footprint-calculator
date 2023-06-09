import './TravelForm.css';


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

function TravelForm({formRef, distanceRef, savedData, openDistanceUtility}) {

  function getDefault(key, trueDefault=null) {
    return savedData ? savedData.get(key) : trueDefault;
  }

  return (
    <div>
    <form ref={formRef}>
      <div className="form-section-header">
        <img src="car.svg" alt="" />
        <h2>Car Travel</h2>
      </div>
      <div className="form-section-inner">
        <p>
            Regularly driving a car can dramatically inflate your carbon footprint. How many miles do you drive per day?
        </p>
        {/* <p>
          If you're not sure how many miles you drive per day, but you regularly drive on a certain route (e.g. from home to the grocery store) at least once per week, click "Add Route" below and we'll help you find the distance.
        </p> */}


            <label>
              Miles driven per day:
              <input type="number" name="milesPerDay" ref={distanceRef}
              min={0} defaultValue={getDefault("milesPerDay", 0)}/>
            </label>
            <br />

            <p>
              What kind of car do you drive?
            </p>
            <label>
              <input type="radio" name="carType" value="gas"
              defaultChecked = {getDefault("carType", "gas") === "gas"}/>
              Gasoline-Powered
            </label>
            <label>
              <input type="radio" name="carType" value="electric"
              defaultChecked = {getDefault("carType") === "electric"}/>
              Full Electric
            </label>
            <label>
              <input type="radio" name="carType" value="plugInHybrid"
              defaultChecked = {getDefault("carType") === "plugin"}/>
              Plug-In Hybrid
            </label>
            <label>
              <input type="radio" name="carType" value="hybrid"
              defaultChecked = {getDefault("carType") === "hybrid"}/>
              Full Hybrid
            </label>


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
            </ul> 
            
                footprintData.total = Object.keys(footprintData.breakdown).reduce(
      (sum, key) => sum + footprintData.breakdown[key].footprint, 0
            
            */}


            
      </div>
    </form>
    {/* <p>
      If you're not sure how many miles you drive each day, please use the Distance Finder:
    </p>
    <button onClick={openDistanceUtility}>Distance Finder</button> */}
    </div>
  );
}

export default TravelForm;