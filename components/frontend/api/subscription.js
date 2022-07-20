const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Subscription {
    create(data) {
        const createPath = backendPath + "/" + this.getSubscriptionRoutes().create
        return apiClient.post(createPath, data)
    }

    read(name, namespace) {
        const readPath = backendPath + "/" + this.getSubscriptionRoutes().read + "/" + namespace + "/" + name
        return apiClient.get(readPath)
    }

    update(name, namespace, data) {
        const updatePath = backendPath + "/" + this.getSubscriptionRoutes().update + "/" + namespace + "/" + name
        return apiClient.put(updatePath, data)

    }

    remove(name, namespace) {
        const deletePath = backendPath + "/" + this.getSubscriptionRoutes().delete + "/" + namespace + "/" + name
        return apiClient.del(deletePath)
    }

    list() {
        const listPath = backendPath + "/" + this.getSubscriptionRoutes().list
        return apiClient.del(listPath)
    }

    getSubscriptionRoutes() {
        return routes.subscription
    }
}

export default Subscription;