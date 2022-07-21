let routesConfig = require('./routes.json');

function getRoutes(){
    return routesConfig;
}

function getBackendPath(){

    return backendHost;
}

module.exports =  {
    getRoutes,
    getBackendPath
}