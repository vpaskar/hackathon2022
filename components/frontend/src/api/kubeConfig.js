const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

export class KubeConfig {
    set(data) {
        const getPath = backendPath + "/" + this.getKubeConfigRoutes().set
        return apiClient.post(getPath, data)
    }

    getKubeConfigRoutes() {
        return routes.kubeConfig
    }
}