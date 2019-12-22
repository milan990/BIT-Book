import React, { Component } from "react";
import { Link } from "react-router-dom";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";
import Search from "../common/Search";

import "./People.css";

export default class People extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            searchString: "",
            matchedUsers: []
        };

        this.getData = new DataService();
        this.redirect = new RedirectionService();

        this.initBind();
    }

    initBind() {
        this.catchSearch = this.catchSearch.bind(this);
        this.filterResults = this.filterResults.bind(this);
        this.getImg = this.getImg.bind(this);
    }

    componentDidMount() {
        this.getData.getUsersData(
            users => {
                this.setState({
                    users,
                    matchedUsers: users
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    catchSearch(searchString) {
        this.setState({
            searchString
        });
    }

    filterResults(searchedString) {
        const users = this.state.users;
        let matchedUsers = [];

        matchedUsers = users.filter(user => {
            let userName = user.name.toLowerCase();
            let searchString = searchedString.toLowerCase();

            return userName.includes(searchString);
        });

        this.setState({
            matchedUsers
        });
    }

    getImg(avatarUrl) {
        if (!avatarUrl) {
            return "http://via.placeholder.com/200x200?text=No%20User%20Image";
        } else {
            return avatarUrl;
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <Search
                    dispatch={this.catchSearch}
                    filterResults={this.filterResults}
                    placeholder="Search Users"
                />
                <div className="row" style={{ padding: "0", marginTop: "65px" }}>
                    {this.state.matchedUsers.map(user => {
                        return (
                            <div className="PeoplePage_cardStyle col-10 offset-1 col-sm-10 offset-sm-1 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2" key={user.id}>
                                <div className="row">
                                    <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3" style={{paddingLeft: "10px", paddingRight: "0", margin: "0 auto"}}>
                                        <div
                                            className="PeoplePage_imgStyle"
                                            style={{
                                                backgroundImage: `url(${this.getImg(user.avatarUrl)})`,
                                                backgroundSize: "130px"
                                            }}
                                        >
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9" style={{padding: "0", position: "relative"}}>
                                        <Link to={`profile/${user.id}`}>
                                            <h4 className="PeoplePage_cardText PeoplePage_userName">
                                                {user.name}
                                            </h4>
                                        </Link>
                                        <p className="PeoplePage_cardText" style={{ paddingBottom: "55px" }}>{user.aboutShort}</p>
                                        <p
                                            className="PeoplePage_cardText"
                                            style={{ textAlign: "right", position: "absolute", bottom: "5px", right: "10px" }}
                                        >
                                            {user.lastPostDate
                                                ? `Last post on ${new Date(
                                                    user.lastPostDate
                                                ).toLocaleDateString()} at ${new Date(
                                                    user.lastPostDate
                                                ).toLocaleTimeString()}`
                                                : "User has not posted anything yet"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
