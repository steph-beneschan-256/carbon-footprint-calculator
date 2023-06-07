/*
Travel form section
*/

import { useRef, useState } from "react";
import RouteWidget from "./RouteWidget";
import formDataManager from "./FormDataManager";

function calculateFootprint() {
    return 5;
}

//formDataManager.registerSection("travel", calculateFootprint )

export default function TravelForm(onDataUpdated) {
    const travelData = useRef(
        [
          {
            distance: 0,
            origin: null,
            destination: null
          }
        ]
    ); 

    useEffect(() => {
        if(!travelData.current)
            travelData.current = formDataManager.loadData("travel")
        //
        if(!travelData.current)
            travelData.current = 
    })

    function updateTravelData(newTravelData) {
        travelData.current = newTravelData;
        onDataUpdated(travelData.current);
    }

    function routeUpdated(dataIndex, newData) {
        updateTravelData((travelData.map((data, index) => {
            return (index !== dataIndex) ? data : newData;
        })));
    }

    function addRouteWidget() {
        if(travelData.length < 5) {
            updateTravelData([
                ...travelData.current,
                {
                    distance: 0,
                    origin: null,
                    destination: null
                }
            ]);
        }
    }
    
    function deleteRouteWidget(index) {
        if(travelData.length > 1) {
          travelData.current = [
            ...travelData.splice(0, index),
            ...travelData.splice(index)
          ];
        }
    }

    return(
        <> 
            {travelData.map((_, index) => (
            <RouteWidget routeNumber={index+1}
            defaultDistance={travelData[index].distance}
            defaultOrigin={travelData[index].origin}
            defaultDestination={travelData[index].destination}

            onDataUpdated={(data) => travelDataUpdated(index, data)}
            />
            ))}
    
            <button onClick={addRouteWidget}>
                + Add Route
            </button>
        </>
    )

    

}