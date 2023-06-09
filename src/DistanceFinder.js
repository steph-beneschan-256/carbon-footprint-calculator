/*
Utility to help user figure out how many miles they drive per week
*/

import { useState } from "react";
import LocationSearcher from "./locationSearcher";

/*
Get distance between two geographic locations, each represented by latitude and longitude
Formula source:
https://en.wikipedia.org/wiki/Geographical_distance#Ellipsoidal_Earth_projected_to_a_plane
*/
function calculateDistance(origin, destination) {
    const lat1 = parseFloat(origin.lat);
    const long1 = parseFloat(origin.lon);
    const lat2 = parseFloat(destination.lat);
    const long2 = parseFloat(destination.lon);

    let meanLat = (lat1 + lat2) / 2 * (Math.PI/180);
    let deltaPhi = (lat1 - lat2)
    let deltaLambda = (long1 - long2)
    let K1 = 111.13209 - 0.56605*Math.cos(2*meanLat) + 0.00120*Math.cos(4*meanLat);
    let K2 = 111.41513*Math.cos(meanLat) - 0.09455 * Math.cos(3*meanLat) + 0.00012*Math.cos(5*meanLat);
    const distanceInKilometers = Math.sqrt(Math.pow(K1*deltaPhi,2) + Math.pow(K2*deltaLambda,2));

    //Convert to miles
    return distanceInKilometers / 1.609;
}

function RouteWidget({defaultOrigin, defaultDestination, defaultDays, onSave, onRemove}) {
    const [editingOrigin, setEditingOrigin] = useState(false);
    const [editingDestination, setEditingDestination] = useState(false);

    const [origin, setOrigin] = useState(defaultOrigin);
    const [destination, setDestination] = useState(defaultDestination);
    const [daysPerWeek, setDaysPerWeek] = useState(defaultDays);

    return(
        <div className="route-widget">
            {editingOrigin ? (
                <LocationSearcher onResultSelected={(result) => {
                    setOrigin(result);
                    setEditingOrigin(false);
                    onSave(origin, destination, daysPerWeek);
                }} />
            ) : (
                <>
                {origin && origin.address_line1}
                <button onClick={e => {setEditingOrigin(true); setEditingDestination(false);}}>
                    {origin ? "Edit" : "Set"} Origin
                </button>
                </>
            )}

            {editingDestination ? (
                <LocationSearcher onResultSelected={(result) => {
                    setDestination(result);
                    setEditingDestination(false);
                    onSave(origin, destination, daysPerWeek);
                }} />
            ) : (
                <>
                {destination && destination.address_line1}
                <button onClick={e => {setEditingDestination(true); setEditingOrigin(false);}}>
                        {destination ? "Edit" : "Set"} Destination
                </button>
                </>
            )}

            <div>
            {(origin && destination) ?
            calculateDistance(origin, destination).toFixed(2) + " mi"
            : "Please select valid locations"
            }
            
            </div>
            

            <label>
                Days per week:
                <input type="number" value={daysPerWeek}
                min={1} max={7} onChange={e => {
                    setDaysPerWeek(e.target.value);
                    onSave(origin, destination, daysPerWeek);}}/>
            </label>

            <button onClick={onRemove}>
                Remove Route
            </button>
        </div>
    )

}

function DistanceFinder({onSave, onCancel}) {

    const [routes, setRoutes] = useState([]);

    function removeRoute(index) {
    if(routes.length > 0) {
        const newRoutes = [
        ...routes.slice(0, index),
        ...routes.slice(index+1)
        ];
        setRoutes(newRoutes);
    }
    }

    function updateRoute(index, newData) {
    const newRoutes = (index >= routes.length) ? routes.concat([newData])
    : routes.map((route, i) => (i !== index) ? route : newData);
    setRoutes(newRoutes);
    }

    return <div className="modal-container">
              {/* TODO: Allow user to close modal by clicking outside of the modal window */}
              <div className="modal-inner">
                  <h3 className="modal-header">Find Distance</h3>

                  {
                    routes.map((route, index) => (
                        <RouteWidget 
                        defaultOrigin={route.origin}
                        defaultDestination={route.destination}
                        defaultDays={route.daysPerWeek}
                        onSave={
                            (newOrigin, newDestination, newDaysPerWeek) => {
                                updateRoute(index, {
                                    origin: newOrigin,
                                    destination: newDestination,
                                    distance: (newOrigin && newDestination) ? calculateDistance(newOrigin, newDestination) : null,
                                    daysPerWeek: newDaysPerWeek
                                })
                            }}
                        onRemove={e => removeRoute(index)}/>
                    ))
                  }
                  
                  <br/>

                  <button onClick={() => updateRoute(routes.length, {
                    origin: null,
                    destination: null,
                    distance: null,
                    daysPerWeek: 1
                  })}>
                    + Add Route
                  </button>

                  <button onClick={() => onSave(routes)}
                  className = "primary-button full-width-button">
                      Calculate Total Distance
                  </button>

                  <br/>

                  <button onClick={onCancel}
                  className = "tertiary-button full-width-button">
                    Cancel
                  </button>
              </div>
          </div>
}



// {routes.map((route, index) => (
//     <div className="route-widget">
//       <b>{route.origin.address_line1}</b> to <b>{route.destination.address_line1}</b>:
//       <br/>
//       {route.distance.toFixed(2)} mi,
//       <input type="number" min={1} max={7}
//       value={route.daysPerWeek} onChange={(e) => {updateRouteData(index, {...route, daysPerWeek: e.target.value})}}/>
//       {parseInt(route.daysPerWeek) === 1 ? "day" : "days"} per week
//       <button onClick={e => removeRoute(index)}
//       className="tertiary-button">
//         Remove route
//       </button>
//     </div>
// ))}

// {(routes.length > 0) && <div>
//     Total:<br/>
//     {(
//       parseFloat(baseDistance) + 
//       routes.map((route) => parseFloat(route.distance) * parseFloat(route.daysPerWeek) / 7).reduce(
//         (sum, d) => sum + d, 0.0
//       )
//     ).toFixed(2)} mi per day
//   </div>}




{/* <button onClick={addRouteButtonClicked}
className="secondary-button">
    + Add Route
</button> */}

export default DistanceFinder