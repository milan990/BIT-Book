import React, { Component } from "react";
import Modal from "react-modal";
import { Switch, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
// import Pagination from "react-js-pagination";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";
import CommunicationService from "../../services/CommunicationService";
import TextPost from "../CreatePost/TextPost";
import ImagePost from "../CreatePost/ImagePost";
import VideoPost from "../CreatePost/VideoPost";
import { POSTS_PER_PAGE } from "../../constants";
import EnlargeImage from "../FeedPage/EnlargeImage";
import Search from "../common/Search";

import "./Feed.css";
import "./AddPostModalStyle.css";

const modalStyle = {
    content: {
        height: "70vh",
        maxWidth: "60vw",
        margin: "0 auto",
        marginTop: "75px"
    }
};

export default class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            textPosts: [],
            imagePosts: [],
            videoPosts: [],

            /* filter states */
            isTextFilterOn: false,
            isImageFilterOn: false,
            isVideoFilterOn: false,
            filterDropDown: "All Posts",

            /* modal states */
            activePage: 0,
            totalPostsCount: 0,
            newTop: POSTS_PER_PAGE,
            hasMore: true,

            /* enlarge image states */
            visibility: "hidden",
            enlargedImg: "",
            isImgShown: false,

            /* search states */
            searchString: "",
            matchedPosts: [],
            searchedResults: false,
            isTextFilterSelected: false,
            isImageFilterSelected: false,
            isVideoFilterSelected: false,
            areAllFilteresOff: true,

            isThereError: false
        };

        this.dataService = new DataService();
        this.redirect = new RedirectionService();
        this.request = new CommunicationService();

        this.bindInit();
    }

    bindInit() {
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.afterPostCreateAction = this.afterPostCreateAction.bind(this);
        this.processVideoUrl = this.processVideoUrl.bind(this);
        this.filterPostsByType = this.filterPostsByType.bind(this);
        this.showPosts = this.showPosts.bind(this);
        this.filterAllPosts = this.filterAllPosts.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.toggleBackToTopButton = this.toggleBackToTopButton.bind(this);
        this.enlargeImage = this.enlargeImage.bind(this);
        this.resetHidden = this.resetHidden.bind(this);
        this.catchSearch = this.catchSearch.bind(this);
        this.filterResultsBySearchString = this.filterResultsBySearchString.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts() {
        this.dataService.getPosts(
            0,
            POSTS_PER_PAGE,
            posts => {
                this.setState({
                    posts: posts,
                    matchedPosts: posts
                });
            },
            error => {
                this.setState({
                    isThereError: true
                });
            }
        );

        this.dataService.getPostCount(
            response => {
                this.setState({
                    totalPostsCount: response
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    // Get posts for PAGINATION (if infinityscroll is off)

    // getPosts() {
    //     this.dataService.getPosts(0, (posts) => {
    //         this.setState({
    //             posts
    //         });
    //     }, (error) => {
    //         console.log(error);
    //         this.setState({
    //             isThereError: true
    //         });
    //     });

    //     this.dataService.getPostCount((response) => {
    //         this.setState({
    //             totalPostsCount: response
    //         });
    //     }, (error) => {
    //         console.log(error);
    //         });
    // }

    /* DISPLAYING POSTS */
    renderPosts() {
        if (this.state.searchedResults) {
            return this.showPosts(this.state.matchedPosts);
        }

        if (this.state.isTextFilterOn) {
            return this.showPosts(this.state.textPosts);
        }

        if (this.state.isImageFilterOn) {
            return this.showPosts(this.state.imagePosts);
        }

        if (this.state.isVideoFilterOn) {
            return this.showPosts(this.state.videoPosts);
        }

        return this.showPosts(this.state.posts);
    }

    showPosts(posts) {
        return (
            <div>
                <p>{this.state.isThereError ? "There's been an error" : ""}</p>
                {posts.map(post => {
                    return (
                        <div
                            key={post.id}
                            className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3"
                            style={{ paddingBottom: "20px" }}
                        >
                            <div className="FeedPage_cardStyle">
                                <Link to={`/profile/${post.userId}`}>
                                    <h2
                                        style={{
                                            fontSize: "1.3em",
                                            paddingTop: "1rem",
                                            color: "#8693AB",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {post.userDisplayName}
                                    </h2>
                                </Link>
                                {this.getConcretePostTypeComponent(post)}
                                <Link to={`/${post.type}/${post.id}`}>
                                    <h4 style={{ fontSize: "1em", color: "#8693AB" }}>
                                        {new Date(post.dateCreated).toLocaleDateString()} at{" "}
                                        {new Date(post.dateCreated).toLocaleTimeString()}
                                    </h4>
                                    <p style={{ fontSize: "0.8em", color: "#8693AB" }}>
                                        {post.type} post
                                    </p>
                                    <p style={{ fontSize: "0.8em", color: "#8693AB", position: "absolute", bottom: "20px", right: "30px" }}>Comments: {post.commentsNum}</p>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    getConcretePostTypeComponent(post) {
        if (post.type === "text") {
            return <p style={{ fontSize: "1.4rem", wordWrap: "break-word" }}>{post.text}</p>;
        }

        if (post.type === "image") {
            return (
                <div>
                    <img
                        src={post.imageUrl}
                        alt="UserPostedImage"
                        className="FeedPage_imgStyle"
                        onClick={this.enlargeImage}
                    />
                </div>
            );
        }

        return this.processVideoUrl(post.videoUrl);
    }

    processVideoUrl(video) {
        const videoEndPart = video.split("=")[1];
        return (
            <iframe
                title="video"
                width="100%"
                height="315"
                className="FeedPage_videoStyle"
                src={`https://www.youtube.com/embed/${videoEndPart}`}
                frameBorder="0"
                allowFullScreen
            />
        );
    }

    /* FILTERING POSTS */
    catchSearch(searchString) {
        this.setState({
            searchString
        });
    }

    filterAllPosts = (event) => {
        this.resetFilters();

        this.setState({
            filterDropDown: event.target.innerHTML
        })

        this.showPosts(this.state.posts);
    }

    filterPostsByType(event) {
        this.resetFilters();

        this.setState({
            filterDropDown: event.target.innerHTML
        })

        let textPostsArray = [];
        let imagePostsArray = [];
        let videoPostsArray = [];

        this.state.posts.map(post => {
            if (post.type === "text") {
                textPostsArray.push(post);
            } else if (post.type === "image") {
                imagePostsArray.push(post);
            } else {
                videoPostsArray.push(post);
            }
        });

        if (event.target.getAttribute("name") === "text") {
            this.setState({
                textPosts: textPostsArray,
                isTextFilterOn: true,
                isTextFilterSelected: true,
                areAllFilteresOff: false
            });
        } else if (event.target.getAttribute("name") === "image") {
            this.setState({
                imagePosts: imagePostsArray,
                isImageFilterOn: true,
                isImageFilterSelected: true,
                areAllFilteresOff: false
            });
        } else if (event.target.getAttribute("name") === "video") {
            this.setState({
                videoPosts: videoPostsArray,
                isVideoFilterOn: true,
                isVideoFilterSelected: true,
                areAllFilteresOff: false
            });
        };
    }

    resetFilters() {
        this.setState({
            isTextFilterOn: false,
            isImageFilterOn: false,
            isVideoFilterOn: false,
            searchedResults: false,
            isTextFilterSelected: false,
            isImageFilterSelected: false,
            isVideoFilterSelected: false,
            areAllFilteresOff: true
        });
    }

    filterResultsBySearchString(searchedString) {
        const posts = this.state.posts;
        let matchedPosts = [];

        if (searchedString === "") {
            this.setState({
                matchedPosts: this.state.posts,
                searchedResults: false
            });
            return;
        }

        matchedPosts = posts.filter(post => {
            if (post.type === "text") {
                let postText = post.text.toLowerCase();
                let searchString = searchedString.toLowerCase();

                return postText.includes(searchString);
            }
        });

        this.setState({
            matchedPosts,
            searchedResults: true
        });
    }

    /* POST CREATION */
    openModal() {
        this.setState({
            modalIsOpen: true
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
        this.redirect.redirect("feed");
    }

    afterPostCreateAction(post, postTypeName) {
        let postType;

        if (postTypeName === "image") {
            postType = "ImagePosts";
        } else if (postTypeName === "text") {
            postType = "TextPosts";
        } else if (postTypeName === "video") {
            postType = "VideoPosts";
        }

        this.dataService.createPost(
            postType,
            post,
            () => {
                this.closeModal();
                this.getPosts();
            },
            error => {
                this.setState({
                    error: error.response,
                    isThereError: true
                });
            }
        );
    }

    /* INFINITY SCROLL */
    handlePageChange() {
        this.dataService.getPostsForInfiniteScroll(
            this.state.newTop,
            posts => {
                this.setState({
                    posts: posts,
                    newTop: this.state.newTop + 10
                });
            },
            error => {
                console.log(error);
            }
        );

        if (this.state.posts.length === this.state.totalPostsCount) {
            this.setState({
                hasMore: false
            });
        }
    }

    // PAGINATION HANDLER (if infinityscroller is off)

    // handlePageChange(pageNumber) {
    //     this.dataService.getPosts((POSTS_PER_PAGE*(pageNumber - 1)), (posts) => {
    //         this.setState({
    //             posts: posts,
    //             activePage: pageNumber
    //         });
    //     }, (error) => {
    //         console.log(error);
    //     });
    // }

    toggleBackToTopButton() {
        this.setState({
            visibility: "hidden"
        });

        if (window.scrollY > 100) {
            this.setState({
                visibility: ""
            });
        }
    }

    backToTop() {
        document.documentElement.scrollTop = 0;
    }

    /* ADDITIONAL FUNCTIONALITIES */
    enlargeImage(event) {
        let img = event.target.src;

        this.setState({
            isImgShown: true,
            enlargedImg: img,
            visibility: ""
        });
    }

    resetHidden() {
        this.setState({
            visibility: "hidden",
            isImgShown: false
        });
    }

    render() {
        return (
            <div className="col-12" style={{ marginTop: "90px" }}>
                {this.state.isImgShown ? (
                    <EnlargeImage
                        imgSrc={this.state.enlargedImg}
                        visibility={this.state.visibility}
                        resetHiddenPic={this.resetHidden}
                    />
                ) : (
                        ""
                    )}
                <div>
                    <div
                        className="row"
                        style={{ marginTop: "30px", marginBottom: "10px" }}
                    >
                        <div className="col-8 offset-2 col-sm-4 offset-sm-1 col-md-3 offset-md-1 col-lg-2 offset-lg-1">
                            <button
                                className="btn FeedPage_generalButtonStyle"
                                style={{
                                    width: "100%",
                                    fontSize: "1rem",
                                    marginBottom: "15px",
                                    position: "relative"
                                }}
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {this.state.filterDropDown}
                            </button>
                            <div
                                className="dropdown-menu FeedPage_dropdownStyle"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <p
                                    className="dropdown-item FeedPage_dropdownElementStyle"
                                    onClick={this.filterAllPosts}
                                    name="allPosts"
                                >
                                    All Posts
                                    {this.state.areAllFilteresOff ? <i className="fa fa-check" style={{ marginLeft: "50px" }}></i> : ""}
                                </p>
                                <p
                                    className="dropdown-item FeedPage_dropdownElementStyle"
                                    onClick={this.filterPostsByType}
                                    name="text"
                                >
                                    Text Posts
                                    {this.state.isTextFilterSelected ? <i className="fa fa-check" style={{ marginLeft: "50px" }}></i> : ""}
                                </p>
                                <p
                                    className="dropdown-item FeedPage_dropdownElementStyle"
                                    onClick={this.filterPostsByType}
                                    name="image"
                                >
                                    Image Posts
                                    {this.state.isImageFilterSelected ? <i className="fa fa-check" style={{ marginLeft: "50px" }}></i> : ""}
                                </p>
                                <p
                                    className="dropdown-item FeedPage_dropdownElementStyle"
                                    onClick={this.filterPostsByType}
                                    name="video"
                                >
                                    Video Posts
                                    {this.state.isVideoFilterSelected ? <i className="fa fa-check" style={{ marginLeft: "50px" }}></i> : ""}
                                </p>
                            </div>
                        </div>
                        <div className="col-10 offset-1 col-sm-10 offset-sm-1 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                            <Search
                                dispatch={this.catchSearch}
                                filterResults={this.filterResultsBySearchString}
                                placeholder="Search Text Posts"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.renderPosts()}
                        <InfiniteScroll
                            refreshFunction={this.refresh}
                            next={this.handlePageChange}
                            onScroll={this.toggleBackToTopButton}
                            hasMore={this.state.hasMore}
                            scrollThreshold={0.7}
                            pullDownToRefreshContent={
                                <h3 style={{ textAlign: "center" }}>
                                    &#8595; Pull down to refresh
                                </h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{ textAlign: "center" }}>
                                    &#8593; Release to refresh
                                </h3>
                            }
                            endMessage={
                                // style={endMsgStyle}
                                <p
                                    style={{
                                        zIndex: "99",
                                        textAlign: "center",
                                        fontStyle: "italic",
                                        color: "gray"
                                    }}
                                >
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            {/* <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={POSTS_PER_PAGE}
                totalItemsCount={this.state.totalPostsCount}
                onChange={this.handlePageChange}
            /> */}
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="FeedPage_createButtonStyle">
                    <input
                        type="button"
                        className="btn"
                        name="createPost"
                        value="+"
                        onClick={this.openModal}
                    />
                </div>

                <input
                    value="Back to Top"
                    type="button"
                    onClick={this.backToTop}
                    style={{
                        visibility: this.state.visibility,
                        position: "fixed",
                        bottom: "0"
                    }}
                />

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Sample"
                    style={modalStyle}
                >
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <h2 className="AddPostModal_updateProfileHeading">Create New Post</h2>
                    </nav>
                    <div className="row">
                        <div className="col-12 AddPostModal_modalCardStyle">
                            <form>
                                <div className="row mx-auto AddPostModal_generalStyle">
                                    <Redirect from="/feed" to="/feed/text" />
                                    <div className="col-12 col-md-4 col-lg-4" style={{ padding: "0" }}>
                                        <Link to="/feed/text">
                                            <button className="btn btn-primary AddPostModal_addPostButtonStyle AddPostModal_switchBoxStyle">
                                                Text Post
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="col-12 col-md-4 col-lg-4" style={{ padding: "0" }}>
                                        <Link to="/feed/image">
                                            <button className="btn  btn-primary AddPostModal_addPostButtonStyle AddPostModal_switchBoxStyle">
                                                Image Post
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="col-12 col-md-4 col-lg-4" style={{ padding: "0" }}>
                                        <Link to="/feed/video">
                                            <button className="btn btn-primary AddPostModal_addPostButtonStyle AddPostModal_switchBoxStyle">
                                                Video Post
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <Switch>
                                    <Route
                                        path="/feed/text"
                                        render={() => (
                                            <TextPost onPostCreate={this.afterPostCreateAction} closeModal={this.closeModal} />
                                        )}
                                    />
                                    <Route
                                        path="/feed/image"
                                        render={() => (
                                            <ImagePost onPostCreate={this.afterPostCreateAction} closeModal={this.closeModal} />
                                        )}
                                    />
                                    <Route
                                        path="/feed/video"
                                        render={() => (
                                            <VideoPost onPostCreate={this.afterPostCreateAction} closeModal={this.closeModal} />
                                        )}
                                    />
                                </Switch>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
