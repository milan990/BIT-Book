// import React from "react";

export default class ValidationService {
    validateName(name) {
        if (!name) {
            return false;
        } else {
            return true;
        }
    }

    validateEmail(email) {
        if (!email) {
            return false;
        } else {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    validatePassword(password) {
        if (password.length < 5) {
            return false;
        } else {
            return true;
        }
    }

    validateConfirmPassword(password, confirmedPassword) {
        if (password !== confirmedPassword) {
            return false;
        } else {
            return true;
        }
    }
}