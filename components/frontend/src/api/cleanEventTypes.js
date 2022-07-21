const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class CleanEventTypes {
    list() {
        return apiClient.get(this.getListEndpoint())
    }

    validateData(data) {
        const message = "Function validation failed: "
        if (!data.runtime) {
            throw new Error(message + 'runtime is missing')
        }
        if (!data.sourceCode) {
            throw new Error(message + 'sourceCode is missing')
        }
    }

    getCleanEventTypesRoutes() {
        return routes.cleanEventTypes
    }

    getListEndpoint() {
        return backendPath + "/" + this.getCleanEventTypesRoutes().list
    }
}

export default Function;