import React from "react";

import AuthenticationService from "../../services/AuthenticationService";
import ValidationService from "../../services/ValidationService";
import RedirectionService from "../../services/RedirectionService";

import "./Register.css";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailString: "",
            passwordString: "",
            userNameString: "",
            confirmedPassword: "",
            error: "",
            isThereError: false,
            nameError: "",
            emailError: "",
            passError: ""    
        };

        this.bindInit();

        this.redirection = new RedirectionService();
        this.authentication = new AuthenticationService();
        this.validation = new ValidationService();
    }

    bindInit() {
        this.changeHandler = this.changeHandler.bind(this);
        this.getAllRegisterData = this.getAllRegisterData.bind(this);
    }

    changeHandler(event){
        if(event.target.name === "userNameString") {
            this.setState({
                userNameString: event.target.value
            });
        }

        if(event.target.name === "emailString") {
            this.setState({
                emailString: event.target.value
            });
        }

        if(event.target.name === "passwordString") {
            this.setState({
                passwordString: event.target.value
            });
        }

        if(event.target.name === "confirmedPassword") {
            this.setState({
                confirmedPassword: event.target.value
            });
        }
    };

    validateEverything(userData){
        this.setState ({
            isThereError: false,
            error: "",
            nameError: "",
            emailError: "",
            passError: "",
            confirmedPassError: ""
        });

        let errorTracker = false;

        if(!this.validation.validateName(userData.name)) {
            this.setState({
                nameError: "User name invalid"
            });
            errorTracker = true;
        }

        if(!this.validation.validateEmail(userData.email)) {
            this.setState({
                emailError: "Email not valid"
            });
            errorTracker = true;
        }

        if(!this.validation.validatePassword(userData.password)) {
            this.setState({
                passError: "Password has to be at least 5 characters long"
            });
            errorTracker = true;
        }

        if(!this.validation.validateConfirmPassword(userData.password, userData.confirmedPassword)) {
            this.setState({
                confirmedPassError: "Passwords don't match"
            });
            errorTracker = true;
        }

        return errorTracker;
    }

    getAllRegisterData(event) {
        event.preventDefault();

        let userData = {
            username: this.state.emailString,
            password: this.state.passwordString,
            confirmedPassword: this.state.confirmedPassword,
            name: this.state.userNameString,
            email: this.state.emailString
        };

        if (!this.validateEverything(userData)) {
            delete userData.confirmedPassword;
            this.authentication.register(userData, (error) => {
                this.setState({
                    isThereError: true,
                    error: error
                });
            });
            
            this.props.informAboutSuccessfulRegister(true);
            this.redirection.redirect("login");
        } else {
            this.setState({
                isThereError: true,
                error: "Form data invalid"
            });

            this.props.informAboutSuccessfulRegister(false);
        }
    }
        
    render() {
        return (
            <div>
                <form>
                    <label htmlFor="fullName" className="labelStyle"><b>Name</b></label>
                    <input type="text" id="fullName" name="userNameString" onChange={this.changeHandler} value={this.state.userNameString} placeholder="Name" className="form-control form-control-lg Register_inputStyle" />
                    <p className="Register_errorStyle">{this.state.nameError ? this.state.nameError : ""}</p>

                    <label htmlFor="registerEmail" className="labelStyle"><b>Email</b></label>
                    <input type="email" id="registerEmail" name="emailString" onChange={this.changeHandler} value={this.state.email} placeholder="Email Address" className="form-control form-control-lg Register_inputStyle" />
                    <p className="Register_errorStyle">{this.state.emailError ? this.state.emailError : ""}</p>
                    
                    <label htmlFor="registerPass" className="labelStyle"><b>Password</b></label>
                    <input type="password" id="registerPass" name="passwordString" onChange={this.changeHandler} value={this.state.passwordString} placeholder="Min 5 characters" className="form-control form-control-lg Register_inputStyle"/>
                    <p className="Register_errorStyle">{this.state.passError ? this.state.passError : ""}</p>

                    <label htmlFor="repeatedPass" className="labelStyle"><b>Repeat Password</b></label>
                    <input type="password" id="repeatedPass" name="confirmedPassword" onChange={this.changeHandler} value={this.state.confirmedPassword} placeholder="Confirm Password" className="form-control form-control-lg Register_inputStyle"/>
                    <p className="Register_errorStyle">{this.state.confirmedPassError ? this.state.confirmedPassError : ""}</p>

                    <button className="btn btn-lg Register_button" id="registerButton" onClick={this.getAllRegisterData}>Register</button>

                    <p className="Register_errorStyle">{this.state.isThereError ? this.state.error : ""}</p>
                </form>
            </div>
        );
    }
}