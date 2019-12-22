import React, { Component } from "react";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";

import "./Posts.css";

export default class TextPost extends Component {
    constructor(props) {
        super(props);

        this.dataService = new DataService();
        this.redirect = new RedirectionService();

        this.state = {
            imagePostContent: "",
            uploadedImage: "",
            successfulUpload: false,
            unsuccessfulUpload: false
        };

        this.bindInit();
    }

    bindInit() {
        this.createImagePost = this.createImagePost.bind(this);
        this.getImagePost = this.getImagePost.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    getImagePost(event) {
        let imagePostContent = event.target.value;

        this.setState({
            imagePostContent
        });
    }

    createImagePost() {
        let imagePostBody = {};
        if (!this.state.imagePostContent) {
            imagePostBody = {
                imageUrl: this.state.uploadedImage,
            };
        } else {
            imagePostBody = {
                imageUrl: this.state.imagePostContent,
            };
        }
        this.props.onPostCreate(imagePostBody, "image");
    }

    uploadImage() {
        const file = document.querySelector("input[type=file]").files[0];

        this.dataService.uploadImage(file, (response) => {
            this.setState({
                uploadedImage: response,
                successfulUpload: true
            });
        }, (error) => {
            this.setState({
                unsuccessfulUpload: true
            });
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <input type="text" placeholder="Enter Image URL" rows="5" className="form-control Posts_inputStyle" onChange={this.getImagePost} required />
                        {this.state.successfulUpload ? <p>Image successfully uploaded!</p> : ""}
                        {this.state.unsuccessfulUpload ? <p>There hass been a mistake, please try again</p> : ""}
                    </div>
                    <div className="col-12 col-sm-7 col-md-5 col-lg-4 col-xl-3">
                        <input type="file" name="file" id="file" className="form-control-file Posts_chooseFileButtonStyle" />
                        <label htmlFor="file" className="Posts_mockChooseFileButton btn">Choose a File</label>
                    </div>

                    <div className="col-12 col-sm-4 offset-sm-1 col-md-3 offset-md-4 col-lg-4 offset-lg-4 col-xl-3 offset-xl-6">
                        <input type="button" onClick={this.uploadImage} value="Upload" className="btn Posts_uploadButtonStyle" />
                    </div>
                    <div className="col-12">
                        <p>{this.state.isThereError ? `Error ${this.state.error}` : ""}</p>
                    </div>
                </div>
                <div>
                    <input type="button" value="Post" className="btn Posts_postButtonStyle col-12 col-sm-12 col-md-4 offset-md-4 col-lg-2 offset-lg-8 col-xl-2 offset-xl-8" name="imagePost" onClick={this.createImagePost} />
                    <input type="button" value="Close" className="btn AddPostModal_closeButton col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2" onClick={this.props.closeModal} />
                </div>
            </div>
        );
    }
}