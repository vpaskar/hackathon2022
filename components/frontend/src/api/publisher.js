const {getBackendPath, getRoutes} = require("../config/config");
const { ApiClient } = require("./client");
const backendPath = getBackendPath()
const routes = getRoutes();
const apiClient = new ApiClient();

export class Publisher {
    publishEvent(eventType, message) {
        const body = {
            "specversion": "1.0",
            "source": "hackathon",
            "type": eventType,
            "eventtypeversion": "v1",
            "id": "A234-1234-1234",
            "data" : message,
            "datacontenttype":"application/json"
        };
        const header = {
            'content-type': 'application/cloudevents+json'
        };
        const createPath = backendPath + "/" + this.getPublisherRoutes().publish;
        return apiClient.post(createPath, body, header);
    }

    getPublisherRoutes() {
        return routes.publisher
    }

}