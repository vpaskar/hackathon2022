const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();

class Subscription {
    create(data) {
        this.validateData(data)
        return ApiClient.get(this.getCreateEndpoint(data.namespace, data.name), data)
    }

    read(namespace, name) {
        return ApiClient.get(this.getReadEndpoint(namespace, name))
    }

    update(name, namespace, data) {
        this.validateData(data)
        return ApiClient.put(this.getUpdateEndpoint(data.namespace, data.name), data)
    }

    remove(namespace, name) {
        return ApiClient.del(this.getRemoveEndpoint(namespace, name))
    }

    list() {
        return ApiClient.get(this.getListEndpoint())
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