import React, { Component } from "react";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";
import CreateComment from "../SinglePostPage/CreateComment";
import GetComments from "../SinglePostPage/GetComments";
import RenderPost from "../SinglePostPage/RenderPost";

import "./SinglePostInfo.css";

export default class SinglePostInfo extends Component {
    constructor(props) {
        super(props);


        this.state = {
            error: false,
            isThereError: false,
            singlePostInfo: {},
            myUserId: "",
            userId: "",
            postId: "",
            comments: [],
            didCommentArrive: false
        };


        this.redirectService = new RedirectionService();
        this.DataService = new DataService();


        this.bindInit();
    }

    bindInit() {
        this.getMyId = this.getMyId.bind(this);
        this.isMyPost = this.isMyPost.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    componentDidMount() {
        this.getMyId();
        let postType;
        const postId = this.props.match.params.id;

        if (this.props.match.params.type === "text") {
            postType = "TextPosts/" + postId;
        } else if (this.props.match.params.type === "image") {
            postType = "ImagePosts/" + postId;
        } else if (this.props.match.params.type === "video") {
            postType = "VideoPosts/" + postId;
        }

        this.DataService.getSinglePost(postType,
            (response) => {
                this.setState({
                    singlePostInfo: response,
                    userId: response.userId,
                    postId: response.id
                });
                this.getComments();
            },
            (error) => {
                this.setState({
                    error: false,
                    isThereError: false
                });
            }
        );
    }

    isMyPost() {
        return this.state.myUserId === this.state.userId;
    }

    getMyId() {
        this.DataService.getProfileData((response) => {
            this.setState({
                myUserId: response.userId
            });
        });
    }

    getComments() {
        const postId = this.state.postId;
        this.DataService.getComments(postId, (response) => {
            this.setState({
                comments: response.data
            });

        }, (error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2" style={{marginTop: "70px"}}>
                        <div className="card SinglePostInfo_cardStyle">
                            <div>
                                <RenderPost singlePost={this.state.singlePostInfo} isMyPost={this.isMyPost} postId={this.state.postId} />
                                <GetComments comments={this.state.comments} />
                                <CreateComment currentUrl={this.props.match.url} postId={this.state.postId} notifyAboutComment={this.getComments} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}