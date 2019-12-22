import React from "react";

import AuthenticationService from "../../services/AuthenticationService";
import ValidationService from "../../services/ValidationService";

import "./Login.css";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emailInput: "",
            passInput: "",
            isThereError: false,
            isThereEmailError: false,
            isTherePassError: false,
            error: ""
        };

        this.authenticationService = new AuthenticationService();
        this.validationService = new ValidationService();

        this.bindInit();
    }

    bindInit() {
        this.getEmailInput = this.getEmailInput.bind(this);
        this.getPassInput = this.getPassInput.bind(this);
        this.handleLoginRequest = this.handleLoginRequest.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    getEmailInput(event) {
        const emailInput = event.target.value;

        this.setState({
            emailInput
        });
    }

    getPassInput(event) {
        const passInput = event.target.value;

        this.setState({
            passInput
        });
    }

    handleLoginRequest(e) {
        e.preventDefault();

        this.setState({
            isThereEmailError: false,
            emailError: "",
            isTherePassError: false,
            passError: "",
            isThereError: false,
            error: ""
        });

        const emailInput = this.state.emailInput;
        const passInput = this.state.passInput;
        let errorTracker = false;

        if(!this.validationService.validateEmail(emailInput)) {
            this.setState({
                emailError: "Email not valid"
            });
            errorTracker = true;
        }
        
        if(!this.validationService.validatePassword(passInput)) {
            this.setState({
                passError: "Password has to be at least 5 characters long"
            });
            errorTracker = true;
        }
        
        if(!errorTracker){
            const userData = {
                username: emailInput,
                password: passInput
            };
    
            this.authenticationService.login(userData, (error) => {
                this.setState({
                    isThereError: true,
                    error: error
                });
            });
    
            this.setState({
                emailInput: "",
                passInput: ""
            });
        } else {
            this.setState({
                isThereError: true,
                error: "Input data is invalid"
            });
        }
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.handleLoginRequest(e);
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleLoginRequest}>
                    <label htmlFor="loginEmail" className="labelStyle" ><b>Email</b></label>
                    <input type="email" id="loginEmail" onChange={this.getEmailInput} onKeyPress={this.handleKeyPress} value={this.state.emailInput} placeholder="Email" className="form-control form-control-lg Login_inputStyle" />
                    <p className="Login_errorStyle">{this.state.emailError ? this.state.emailError : ""}</p>
                    
                    <label htmlFor="loginPass" className="labelStyle" ><b>Password</b></label>
                    <input type="password" id="loginPass" onChange={this.getPassInput} onKeyPress={this.handleKeyPress} value={this.state.getPassInput} placeholder="Password" className="form-control form-control-lg Login_inputStyle" />
                    <p className="Login_errorStyle">{this.state.passError ? this.state.passError : ""}</p>

                    <button className="btn btn-lg Login_button" onClick={this.handleLoginRequest} id="loginButton">Login</button>

                    <p className="Login_errorStyle">{this.state.isThereError ? this.state.error : ""}</p>
                </form>
            </div>
        );
    }
}