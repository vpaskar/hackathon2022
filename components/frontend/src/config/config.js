let routesConfig = require('./routes.json');

function getRoutes(){
    return routesConfig;
}

function getBackendPath(){
    const backendHost = process.env.BACKEND_HOST
    if (!backendHost) {
        // throw new Error("Cannot fetch the backend host")
    }
    return backendHost;
}

module.exports =  {
    getRoutes,
    getBackendPath
}