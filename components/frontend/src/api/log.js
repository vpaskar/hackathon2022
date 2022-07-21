const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Log {
    get(name, resourceType, namespace) {
        const getPath = backendPath + "/" + this.getLogRoutes().read + "/" + namespace + "/" + resourceType + "/" + name
        return apiClient.get(getPath)
    }

    getLogRoutes() {
        return routes.log
    }

}

export default Log;