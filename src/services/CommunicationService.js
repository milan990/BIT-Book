import { BASE_URL, API_KEY } from "../constants";
import axios from "axios";

export default class CommunicationService {
    constructor() {
        this.createHeaders = this.createHeaders.bind(this);
    }

    createHeaders() {
        let sessionId = sessionStorage.getItem("sessionId");

        if (sessionId) {
            return {
                "Key": API_KEY,
                "sessionId": sessionId
            };
        }

        return {
            "Key": API_KEY
        };
    }

    postRequest(address, body, notifyPostRequest, handleError) {

        const requestURL = `${BASE_URL}/${address}`;

        axios.post(requestURL, body, {
            headers: this.createHeaders()
        })
            .then(response => {
                notifyPostRequest(response);
            })
            .catch(error => {
                let errorMsg = error.response ? error.response.data : "Server unavailable";
                handleError(errorMsg);
            });
    }

    getRequest(address, notifyGetRequest, handleError) {
        const requestURL = `${BASE_URL}/${address}`;

        axios.get(requestURL, {
            headers: this.createHeaders()
        })
            .then(response => {
                notifyGetRequest(response);
            })
            .catch(error => {
                let errorMsg = error.response ? error.response.code : "Server unavailable";
                handleError(errorMsg);
            });
    }

    putRequest(address, data, notifyPutRequest, handleError) {
        const requestURL = `${BASE_URL}/${address}`;
        
        axios.put(requestURL, data, {
            headers: this.createHeaders()
        })
            .then(response => {
                notifyPutRequest(response);
            })
            .catch(error => {
                let errorMsg = error.response ? error.response.status : "Server unavailable";
                handleError(errorMsg);
            });
    }

    deleteRequest(id, deleteHandler, errorHandler) {
        const requestURL = `${BASE_URL}/Posts/${id}`;
        
        axios.delete(requestURL, {
            headers: this.createHeaders()
        })
            .then(response => deleteHandler(response))
            .catch(error => errorHandler(error));
    }

}