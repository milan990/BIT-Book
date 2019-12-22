import React, { Component } from "react";
import { Link } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import "./Header.css";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feedPage: "#F1FFFA",
            peoplePage: "",
            profilePage: ""
        }

        this.bindInit();

        this.logout = new AuthenticationService();
    }

    bindInit() {
        this.indicatePage = this.indicatePage.bind(this);
    }

    indicatePage() {
        const temp = window.location.href.split("/");
        const currentLocation = temp[temp.length - 1];

        switch(currentLocation) {
            case "feed":
                this.setState({
                    feedPage: "#F1FFFA",
                    peoplePage: "",
                    profilePage: ""
                });
                break;
            case "people":
                this.setState({
                    feedPage: "",
                    peoplePage: "#F1FFFA",
                    profilePage: ""
                });
                break;
            case "profile":
                this.setState({
                    feedPage: "",
                    peoplePage: "",
                    profilePage: "#F1FFFA"
                })
        }
    }

    render() {
        return (
            <nav className="col-12 navbar navbar-expand-lg navbar-dark Header_navColor" >
                <Link to="/feed" className="Header_logoStyle">
                    BitBook
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end pull-right" id="navbarColor01">
                    <ul className="navbar-nav" style={{ fontSize: "1.2em", backgroundColor: "#785964" }}>
                        <li data-target="#navbarColor01" onClick={this.indicatePage}>
                            <Link className="Header_navLinkStyle" to="/feed" style={{ color: this.state.feedPage }}>
                                Feed<span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li data-target="#navbarColor01" onClick={this.indicatePage}>
                            <Link className="Header_navLinkStyle" to="/people" style={{ color: this.state.peoplePage }}>
                                People
                            </Link>
                        </li>
                        <li data-target="#navbarColor01" onClick={this.indicatePage}>
                            <Link className="Header_navLinkStyle" to="/profile" style={{ color: this.state.profilePage }}>
                                Profile
                            </Link>
                        </li>
                        <li onClick={this.logout.logout}>
                            <Link className="Header_navLinkStyle" to="/login">
                                Log Out
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}