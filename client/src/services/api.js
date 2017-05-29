import config from '../config.js';
import Auth from "./auth.js";

export default class Api {

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    send(method, url, data, callback) {

        if (Auth.isUserAuthenticated()) {
            url += '?token=' + Auth.getAuthenticatedToken();
        }
        this.xhr.open(method, config.url + url);
        this.xhr.responseType = 'json';
        this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var formData = null;
        if(data) {
            formData = "";
            for (var key in data) {
                formData += key + '=' +encodeURIComponent(data[key])  + "&";
            }  
        }

        this.xhr.onload = function() {
            callback(this.xhr.status, this.xhr.response);
        }.bind(this);

        this.xhr.send(formData);
    }
 }