import {getBackendPath,getRoutes} from "../config/config";
import {ApiClient} from "./client";
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

export class Function {
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

    async list() {
        return await apiClient.get(this.getListEndpoint())
    }

    logs(name, namespace) {
        return apiClient.get(this.getLogsEndpoint(namespace, name))
    }

    validateData(data) {
        const message = "Function validation failed: "
        if (!data.name) {
            throw new Error(message + 'name is missing')
        }
        if (!data.namespace) {
            throw new Error(message + 'namespace is missing')
        }
        // if (!data.sourceCode) {
        //     throw new Error(message + 'sourceCode is missing')
        // }
    }

    getFunctionRoutes() {
        return routes.function
    }

    getCreateEndpoint(namespace, name) {
        return backendPath  + this.getFunctionRoutes().create.replace("{ns}", namespace).replace("{name}", name)
    }

    getReadEndpoint(namespace, name) {
        return backendPath  + this.getFunctionRoutes().read.replace("{ns}", namespace).replace("{name}", name)
    }

    getUpdateEndpoint(namespace, name) {
        return backendPath  + this.getFunctionRoutes().update.replace("{ns}", namespace).replace("{name}", name)
    }

    getRemoveEndpoint(namespace, name) {
        return backendPath  + this.getFunctionRoutes().delete.replace("{ns}", namespace).replace("{name}", name)
    }

    getListEndpoint() {
        return backendPath +  this.getFunctionRoutes().list
    }

    getLogsEndpoint(namespace, name) {
        return backendPath +  this.getFunctionRoutes().logs.replace("{ns}", namespace).replace("{name}", name)
    }
}