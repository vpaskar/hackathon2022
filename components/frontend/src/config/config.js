let routesConfig = require('./routes.json');

function getRoutes(){
    return routesConfig;
}

function getBackendPath(){
    return routesConfig.backendEndpoint
}

module.exports =  {
    getRoutes,
    getBackendPath
}