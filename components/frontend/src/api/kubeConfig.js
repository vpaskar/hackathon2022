const {getBackendPath, getRoutes} = require("../config/config");
const {ApiClient} = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

export class KubeConfig {
    async set(data) {
        const getPath = backendPath + "/" + this.getKubeConfigRoutes().set;
        const header = {
            'content-type': 'text/plain'
        }
        try {
            return await apiClient.post(getPath, data, header);
        }
        catch {
            return null;
        }

    }

    getKubeConfigRoutes() {
        return routes.kubeConfig
    }
}