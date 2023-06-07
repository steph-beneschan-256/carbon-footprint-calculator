class FormDataManager {
    constructor() {
        this.data = {
            travel: null
        }
    }

    saveData(dataType, newData) {
        this.data[dataType] = newData;
    }

    loadData(dataType) {
        return this.data[dataType];
    }
}

const formDataManager = new FormDataManager();
export default formDataManager;