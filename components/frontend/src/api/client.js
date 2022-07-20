// api client to interact with backend
const axios = require('axios').default;


function get(path) {
    axios.get(path)
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

function post(path, data) {
    axios.post(path, data)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}


function put(path, data) {
    axios.put(path, data)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function del(path) {
    axios.delete(path)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function setHeaders(){
    // todo set the headers
}