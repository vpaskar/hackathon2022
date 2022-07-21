const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Publisher {
    publishEvent(data) {
        const createPath = backendPath + "/" + this.getPublisherRoutes().publish
        return apiClient.post(createPath, data)
    }

    getPublisherRoutes() {
        return routes.publisher
    }

}

export default Publisher;