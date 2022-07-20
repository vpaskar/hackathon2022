let routesConfig = require('./routes.json');

function getRoutes(){
    return routesConfig;
}

function getBackendPath(){
    return process.env.BACKEND_HOST
}

module.exports =  {
    getRoutes,
    getBackendPath
}