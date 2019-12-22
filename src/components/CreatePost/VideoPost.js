import React, { Component } from "react";

import "./Posts.css";

export default class VideoPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            isThereError: false,
            videoPostContent: ""
        };

        this.bindInit();
    }

    bindInit() {
        this.createVideoPost = this.createVideoPost.bind(this);
        this.getVideoPost = this.getVideoPost.bind(this);
    }

    getVideoPost(event) {
        let videoPostContent = event.target.value;

        this.setState({
            videoPostContent
        });
    }

    createVideoPost() {
        const videoPostBody = {
            videoUrl: this.state.videoPostContent,
        };

        this.props.onPostCreate(videoPostBody, "video");
    }


    render() {
        return (
            <div>
                <input type="text" placeholder="Share a video with the world!" onChange={this.getVideoPost} className="form-control Posts_inputStyle" required />
                <div>
                    <input type="button" value="Post" className="btn Posts_postButtonStyle col-12 col-sm-12 col-md-4 offset-md-4 col-lg-2 offset-lg-8 col-xl-2 offset-xl-8" name="videoPost" onClick={this.createVideoPost} />
                    <input type="button" value="Close" className="btn AddPostModal_closeButton col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2" onClick={this.props.closeModal} />
                </div>
                <p>{this.state.isThereError ? `Error ${this.state.error}: Please enter the text of your post` : ""}</p>
            </div>
        );
    }
}