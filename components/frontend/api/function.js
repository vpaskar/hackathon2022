const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Function {
    create(data) {
        const createPath = backendPath + "/" + this.getFunctionRoutes().create
        return apiClient.post(createPath, data)
    }

    read(name, namespace) {
        const readPath = backendPath + "/" + this.getFunctionRoutes().read + "/" + namespace + "/" + name
        return apiClient.get(readPath)
    }

    update(name, namespace, data) {
        const updatePath = backendPath + "/" + this.getFunctionRoutes().update + "/" + namespace + "/" + name
        return apiClient.put(updatePath, data)

    }

    remove(name, namespace) {
        const deletePath = backendPath + "/" + this.getFunctionRoutes().delete + "/" + namespace + "/" + name
        return apiClient.del(deletePath)
    }

    list() {
        const listPath = backendPath + "/" + this.getFunctionRoutes().list
        return apiClient.del(listPath)
    }

    getFunctionRoutes() {
        return routes.function
    }
}

export default Function;