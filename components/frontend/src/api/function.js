import {getBackendPath,getRoutes} from "../config/config";
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();

class Function {
    create(data) {
        this.validateData(data)
        return ApiClient.post(this.getCreateEndpoint(data.namespace, data.name), data)
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
        const message = "Function validation failed: "
        if (!data.runtime) {
            throw new Error(message + 'runtime is missing')
        }
        if (!data.sourceCode) {
            throw new Error(message + 'sourceCode is missing')
        }
    }

    getFunctionRoutes() {
        return routes.Function
    }

    getCreateEndpoint(namespace, name) {
        return backendPath + "/" + this.getFunctionRoutes().create.replace("{ns}", namespace).replace("{name}", name)
    }

    getReadEndpoint(namespace, name) {
        return backendPath + "/" + this.getFunctionRoutes().read.replace("{ns}", namespace).replace("{name}", name)
    }

    getUpdateEndpoint(namespace, name) {
        return backendPath + "/" + this.getFunctionRoutes().update.replace("{ns}", namespace).replace("{name}", name)
    }

    getRemoveEndpoint(namespace, name) {
        return backendPath + "/" + this.getFunctionRoutes().delete.replace("{ns}", namespace).replace("{name}", name)
    }

    getListEndpoint() {
        return backendPath + "/" + this.getFunctionRoutes().create
    }
}

export default Function;