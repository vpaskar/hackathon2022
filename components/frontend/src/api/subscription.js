const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Subscription {
    create(data) {
        this.validateData(data)
        return apiClient.post(this.getCreateEndpoint(data.namespace, data.name), data)
    }

    read(namespace, name) {
        return apiClient.get(this.getReadEndpoint(namespace, name))
    }

    update(name, namespace, data) {
        this.validateData(data)
        return apiClient.put(this.getUpdateEndpoint(data.namespace, data.name), data)
    }

    remove(namespace, name) {
        return apiClient.del(this.getRemoveEndpoint(namespace, name))
    }

    list() {
        return apiClient.get(this.getListEndpoint())
    }

    validateData(data) {
        const message = "Subscription validation failed: "
        if (!data.sink) {
            throw new Error(message + 'sink is missing')
        }
        if (!data.appName) {
            throw new Error(message + 'appName is missing')
        }
        if (!data.eventName) {
            throw new Error(message + 'eventName is missing')
        }
        if (!data.eventVersion) {
            throw new Error(message + 'eventVersion is missing')
        }
    }

    getSubscriptionRoutes() {
        return routes.subscription
    }

    getCreateEndpoint(namespace, name) {
        return backendPath + "/" + this.getSubscriptionRoutes().create.replace("{ns}", namespace).replace("{name}", name)
    }

    getReadEndpoint(namespace, name) {
        return backendPath + "/" + this.getSubscriptionRoutes().read.replace("{ns}", namespace).replace("{name}", name)
    }

    getUpdateEndpoint(namespace, name) {
        return backendPath + "/" + this.getSubscriptionRoutes().update.replace("{ns}", namespace).replace("{name}", name)
    }

    getRemoveEndpoint(namespace, name) {
        return backendPath + "/" + this.getSubscriptionRoutes().delete.replace("{ns}", namespace).replace("{name}", name)
    }

    getListEndpoint() {
        return backendPath + "/" + this.getSubscriptionRoutes().create
    }
}

export default Subscription;