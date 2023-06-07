class DistanceTools {
    constructor() {
        this.recentLocations = []; // Locations recently added by the user
    }

    /*
    Get distance between two geographic locations, each represented by latitude and longitude
    Formula source:
    https://en.wikipedia.org/wiki/Geographical_distance#Ellipsoidal_Earth_projected_to_a_plane
    (Note: I reused the code from my submission for Challenge 1)
    */
    getDistance(lat1, long1, lat2, long2) {
        let meanLat = (lat1 + lat2) / 2 * (Math.PI/180);
        let deltaPhi = (lat1 - lat2)
        let deltaLambda = (long1 - long2)
        let K1 = 111.13209 - 0.56605*Math.cos(2*meanLat) + 0.00120*Math.cos(4*meanLat);
        let K2 = 111.41513*Math.cos(meanLat) - 0.09455 * Math.cos(3*meanLat) + 0.00012*Math.cos(5*meanLat);
        const distanceInMeters = Math.sqrt(Math.pow(K1*deltaPhi,2) + Math.pow(K2*deltaLambda,2));

        //Convert to miles
        return distanceInMeters / 1609;
    }

}

const distanceTools = new DistanceTools();
export default distanceTools;