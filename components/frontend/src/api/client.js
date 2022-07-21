// api client to interact with backend
const axios = require('axios').default;

export class ApiClient {
    async get(path) {
        return await axios.get(path, {
                headers: this.getHeaders()
            }
        );
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