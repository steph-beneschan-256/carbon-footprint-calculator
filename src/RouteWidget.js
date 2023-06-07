import { useState } from "react";
import LocationSearcher from "./locationSearcher";
import distanceTools from "./distanceTools";

import "./RouteWidget.css";

export default function RouteWidget({routeNumber, defaultDistance, defaultOrigin, defaultDestination, onDataUpdated}) {

    const [distance, setDistance] = useState(defaultDistance);

    const [modalOpen, setModalOpen] = useState(false);
    const [origin, setOrigin] = useState(defaultOrigin);
    const [destination, setDestination] = useState(defaultDestination);

    const [isRoundTrip, setIsRoundTrip] = useState(true);
    

    

    function updateOrigin(newOrigin) {
        setOrigin(newOrigin);
        console.log(newOrigin);
    }

    function openLocationModal() {
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function calculateDistance() {
        if(!(origin && destination))
            return;

        const newDistance = distanceTools.getDistance(
            parseFloat(origin.lat), parseFloat(origin.lon), 
            parseFloat(destination.lat), parseFloat(destination.lon));
        setDistance(newDistance.toFixed(2));

        onDataUpdated({
            origin: origin,
            destination: destination,
            distance: newDistance
        })

    }

    return(
        <>
            {modalOpen && (
                <div className="modal-container">
                    {/* TODO: Allow user to close modal by clicking outside of the modal window */}
                    <div className="modal-inner">
                        <h3 className="modal-header">Find Distance</h3>

                        <h4>From this location:</h4>
                        <LocationSearcher onResultSelected={(result) => {
                            setOrigin(result);
                            updateOrigin(result);
                            console.log(result);
                        }} />

                        {origin && <>{origin.address_line1} {origin.address_line2}</>}

                        <h4>To this location:</h4>
                        <LocationSearcher onResultSelected={(result) => {
                            setDestination(result);
                        }} />

                        {destination && <>{destination.address_line1} {destination.address_line2}</>}

                        <br/>

                        <button onClick={e => {
                            calculateDistance();
                            closeModal();
                        }}>
                            Calculate Distance
                        </button>

                        <br/>

                        <button onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="route-widget">
                <h3>Route {routeNumber}</h3>

                <label>
                    Distance driven on this route:
                    <input type="number" step="any"
                    value={distance} onChange={e => {
                        setDistance(e.target.value);
                        setOrigin(null);
                        setDestination(null);

                        onDataUpdated({
                            origin: null,
                            destination: null,
                            distance: e.target.value
                        })
                    }} />
                    <span>mi</span>
                </label>
                
                <br/>
                
                {(origin && destination) && <>
                    <div>
                        <span className="location-label-a">
                            From:
                        </span>
                        <span className="location-label-b">
                            {origin.address_line1} {origin.address_line2}
                        </span>
                    </div>
                    <div>
                        <span className="location-label-a">
                            To:
                        </span>
                        <span className="location-label-b">
                            {destination.address_line1} {destination.address_line2}
                        </span>
                    </div>
                </>}
                
                <br />

                <button onClick={openLocationModal}>
                    Find Route Distance
                </button>
            </div>
        </>
    )
}