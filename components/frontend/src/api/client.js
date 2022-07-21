// api client to interact with backend
const axios = require('axios').default;

export class ApiClient {
    async get(path) {
        return await axios.get(path, {
                headers: this.getHeaders()
            }
        );
    }

    async post(path, data) {
        return await axios.post(path, data, {
            headers: this.getHeaders()
        });
    }


    async put(path, data) {
        return await axios.put(path, data, {
            headers: this.getHeaders()
        });
    }


    async del(path) {
       return await axios.delete(path, {
            headers: this.getHeaders()
        });
    }

    getHeaders() {
        return {
            'content-type': 'application/json'
        }
    }
}