/*
This class is meant to allow us to more easily save the user's input without having to pass state updates up to the App component's state, and to more easily compartmentalize the different activity types being measured/different sections of the input form.
*/


class FormDataManager {
    constructor() {
        this.data = {};
        this.footprintDataGetters = {};
        this.suggestionGenerators = {};
    }

    /*
    Save/load the data that the user entered into a particular section of the form, so it can be accessed later (e.g. if the user looks at the results and then goes back to the form) 
    */
    loadData(key) {
        return this.data[key];
    }
    saveData(key, newData) {
        this.data[key] = newData;
    }

    /*
    The user should be able to see not only their total carbon footprint, but their footprint in specific areas (such as how much CO2 they emit while traveling,
    how much they emit from food, etc.). So, for each type of CO2-emitting activity that the app asks the user about (travel, food, etc.), there needs to be
    a function that takes the user's input for that specific activity, then calculates and returns the user's carbon footprint for that activity.

    For each activity type, please call the addActivityType method with a unique string describing the activity type (e.g. "TRAVEL" or "FOOD") and a function
    to calculate the user's footprint data (i.e. total footprint and suggestions for reducing it) for that activity. This will register the function in the FormDataManager class for later use.

    The function should be asynchronous, since we need to call APIs to calculate the footprint for some activities (e.g. calling the myclimate API for travel data). 
    */

    addActivityType(activityTypeKey, footprintDataGetter) {
        this.footprintDataGetters[activityTypeKey] = footprintDataGetter;
    }

    /*
    Create an object with the user's total carbon footprint (in g of CO2-eq),
    as well as individual footprints and suggestions for different activity types
    */
    async calculateTotalFootprint() {
        return Promise.all(Object.keys(this.data).map((key) => this.footprintDataGetters[key](this.data[key]))).then((allData) => {
            let footprintData = {"breakdown": {}};
            let totalFootprint = 0;

            allData.forEach((data) => {
                footprintData.breakdown[data.key] = data;
                totalFootprint += data.footprint;
            })

            footprintData["total"] = totalFootprint;
            console.log(footprintData);
            return footprintData;
        })
    }
}

const formDataManager = new FormDataManager();
export default formDataManager;