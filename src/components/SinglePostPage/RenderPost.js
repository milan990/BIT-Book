import React, { Component } from "react";
import { Link } from "react-router-dom";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";

import "./RenderPost.css";

export default class RenderPost extends Component {
    constructor(props) {
        super(props);
    
        this.bindInit();

        this.dataService = new DataService();
        this.redirectionService = new RedirectionService();
    }

    bindInit() {
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.processVideoUrl = this.processVideoUrl.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }
    
    renderDeleteButton() {
        const isMyPost = this.props.isMyPost();

        if (isMyPost) {
            return <input className="btn RenderPost_deleteButtonStyle col-sm-5 offset-sm-6 col-md-3 offset-md-8 col-lg-3 offset-lg-8" type="button" value="Delete Post" onClick={this.deletePost} />;
        }
    }

    deletePost(e) {
        const postId = this.props.postId;
        this.dataService.deletePost(postId, (response) => {
            this.redirectionService.redirect("feed");
        }, (error) => {
            console.log(error);
        });
    }

    processVideoUrl(video) {
        const videoEndPart = video.split("=")[1];
        return (
            <iframe title="postedVideo" width="90%" height="415" className="RenderPost_videoStyle" src={`https://www.youtube.com/embed/${videoEndPart}`} frameBorder="0" allowFullScreen></iframe>
        );
    }

    render() {
        const singlePost = this.props.singlePost;
        
        return (
            <div>
                <Link to={`/profile/${singlePost.userId}`}>
                    <h3 className="card-title RenderPost_profileName">{singlePost.userDisplayName}</h3>
                </Link>
                <p className="RenderPost_headerDateStyle">{singlePost.dateCreated}</p>
                <p>{singlePost.text ? <p className="RednerPost_textPostStyle">{singlePost.text}</p> : singlePost.imageUrl ? <img alt="Posted Pic" src={singlePost.imageUrl} className="RenderPost_imgStyle" /> : singlePost.videoUrl ? this.processVideoUrl(singlePost.videoUrl) : "no content detected"}</p>
                {this.renderDeleteButton()}
            </div>
        );
    }
}