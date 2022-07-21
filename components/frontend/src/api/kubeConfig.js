const {getBackendPath, getRoutes} = require("../config/config");
const ApiClient = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();

class KubeConfig {
    set(kubeConfigPath) {
        const getPath = backendPath + "/" + this.getKubeConfigRoutes().set
        const data = {
            kubeConfigPath: kubeConfigPath
        }
        return ApiClient.post(getPath, data)
    }

    getKubeConfigRoutes() {
        return routes.kubeConfig
    }

}

export default KubeConfig;