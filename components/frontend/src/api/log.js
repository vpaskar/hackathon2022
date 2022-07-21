const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();

class Log {
    get(name, resourceType, namespace) {
        const getPath = backendPath + "/" + this.getLogRoutes().read + "/" + namespace + "/" + resourceType + "/" + name
        return ApiClient.get(getPath)
    }

    getLogRoutes() {
        return routes.log
    }

}

export default Log;