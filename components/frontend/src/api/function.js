import {getBackendPath,getRoutes} from "../config/config";
import {ApiClient} from "./client";
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

class Function {
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

    async remove(namespace, name) {
        return await apiClient.del(this.getRemoveEndpoint(namespace, name))
    }

    async list() {
        return await apiClient.get(this.getListEndpoint())
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

    getFunctionNameBySink(sink){
        const regexp = /https*:\/\/([a-zA-Z-]*)\./g;

        const array = [...sink.matchAll(regexp)];

        return(array[0][1]);
    }
}

export default Function;