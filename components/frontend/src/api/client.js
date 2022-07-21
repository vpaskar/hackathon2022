// api client to interact with backend
const axios = require('axios').default;

class ApiClient {
    static get(path) {
        axios.get(path, {
                headers: ApiClient.getHeaders()
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

    static post(path, data) {
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


    static put(path, data) {
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


    static del(path) {
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

    static getHeaders() {
        return {
            'content-type': 'application/json'
        }
    }
}

export default ApiClient;