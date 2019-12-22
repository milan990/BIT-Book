import React, { Component } from "react";

import DataService from "../../services/DataService";

import "./Posts.css";

export default class TextPost extends Component {
    constructor(props) {
        super(props);

        this.dataService = new DataService();

        this.state = {
            textPostContent: ""
        };

        this.bindInit();
    }

    bindInit() {
        this.createTextPost = this.createTextPost.bind(this);
        this.getTextPost = this.getTextPost.bind(this);
    }

    getTextPost(event) {
        let textPostContent = event.target.value;

        this.setState({
            textPostContent
        });
    }

    createTextPost() {
        const textPostBody = {
            text: this.state.textPostContent,
        };

        this.props.onPostCreate(textPostBody, "text");
    }

    render() {
        return (
            <div>
                <textarea placeholder="What's on your mind?" rows="7" className="form-control Posts_inputStyle" onChange={this.getTextPost} required></textarea>

                <input type="button" value="Post" className="btn Posts_postButtonStyle col-12 col-sm-12 col-md-4 offset-md-4 col-lg-2 offset-lg-8 col-xl-2 offset-xl-8" name="textPost" onClick={this.createTextPost} />
                <input type="button" value="Close" className="btn AddPostModal_closeButton col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2" onClick={this.props.closeModal} />

                <div>{this.state.isThereError ? `Error ${this.state.error}` : ""}</div>
            </div>
        );
    }
}