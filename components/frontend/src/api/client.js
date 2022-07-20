// api client to interact with backend
const {getRoutes, getBackendPath} = require("../config/config");
const axios = require('axios').default;

class ApiClient {


    get(path) {
        axios.get(path, {
                headers: this.getHeaders()
            }
        )
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    post(path, data) {
        axios.post(path, data, {
            headers: this.getHeaders()
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    put(path, data) {
        axios.put(path, data, {
            headers: this.getHeaders()
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    del(path) {
        axios.delete(path, {
            headers: this.getHeaders()
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getHeaders() {
        return {
            'content-type': 'application/json'
        }
    }
}

export default ApiClient;