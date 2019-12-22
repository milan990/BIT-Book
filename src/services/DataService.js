import CommunicationService from "./CommunicationService";
import Profile from "../entities/Profile";
import User from "../entities/User";
import Post from "../entities/Posts";

export default class DataService {
    constructor() {

        this.communication = new CommunicationService();
    }

    getProfileData(profileDataHandler) {
        this.communication.getRequest("profile", (response) => {
            const profile = new Profile(response.data);
            profileDataHandler(profile);
        });
    }

    getSingleUserData(datahandler, userId, errorHandler) {
        this.communication.getRequest(`users/${userId}`, (response) => {
            const profile = new Profile(response.data);
            datahandler(profile);
        }, (error) => {
            if (!errorHandler) {
                console.log("Handler not provided");
            } else {
                errorHandler(error);
            }
        });
    }

    getUsersData(userDataHandler, errorHandler) {
        this.communication.getRequest("users", (response) => {
            let userInfo = response.data;
            let listOfUsers = [];
            userInfo.forEach((user) => {
                const newUser = new User(user);
                listOfUsers.push(newUser);
            });

            userDataHandler(listOfUsers);
        }, (error) => {
            if (!errorHandler) {
                console.warn("Handler not provided");
            } else {
                errorHandler(error);
            }
        });
    }

    updateProfileData(newData, errorHandler) {
        this.communication.putRequest("Profiles", newData, (response) => {
            if (response.status >= 200 && response.status < 400) {
                window.location.reload();
            };
        }, (error) => {
            if (!errorHandler) {
                console.log("Handler not provided");
            } else {
                errorHandler(error);
            }
        });
    }

    getPosts(pagesToSkip, pagesToRender, postsHandler, errorHandler) {
        this.communication.getRequest(`Posts?$skip=${pagesToSkip}&$top=${pagesToRender}&$orderby=DateCreated desc`, (posts) => {
            let postInfo = posts.data;
            let listOfPosts = [];
            postInfo.forEach((post) => {
                const newPost = new Post(post);
                listOfPosts.push(newPost);
            });
            postsHandler(listOfPosts);
        }, (error) => {
            if (!errorHandler) {
                console.log("Handler not provided");
            } else {
                errorHandler(error);
            }
        });
    }

    getPostsForInfiniteScroll(postsToRender, postsHandler, errorHandler) {
        this.communication.getRequest(`Posts?$top=${postsToRender}&$orderby=DateCreated desc`, (posts) => {
            let postInfo = posts.data;
            let listOfPosts = [];
            postInfo.forEach((post) => {
                const newPost = new Post(post);
                listOfPosts.push(newPost);
            });
            postsHandler(listOfPosts);
        }, (error) => {
            if (!errorHandler) {
                console.log("Handler not provided");
            } else {
                errorHandler(error);
            }
        });
    }

    createPost(postType, textPostContent, successHandler, errorHandler) {
        this.communication.postRequest(
            postType,
            textPostContent,
            (response) => {
                successHandler(response.data);
            },
            (error) => {
                errorHandler(error);
            });
    }

    getSinglePost(postType, notifySinglePost, errorHandler) {
        this.communication.getRequest(
            postType,
            (response) => {
                notifySinglePost(response.data);
            },
            (error) => {
                errorHandler(error);
            }
        );
    }

    deletePost(id, successHandler, errorHandler) {
        this.communication.deleteRequest(id, (serverResponseData) => {
            successHandler(serverResponseData);
        }, (serverErrorObject) => {
            errorHandler(serverErrorObject);
        });
    }

    postComment(body, successHandler, errorHandler) {
        this.communication.postRequest("Comments", body, (response) => {
            successHandler(response);
        }, (error) => {
            errorHandler(error);
        });
    }

    getComments(postId, successHandler, errorHandler) {
        this.communication.getRequest(`Comments/?postId=${postId}`, (response) => {
            successHandler(response);
        }, (error) => {
            errorHandler(error);
        });
    }

    getPostCount(handleSuccess, errorHandler) {
        this.communication.getRequest("posts/count", (response) => {
            handleSuccess(response.data);
        }, (error) => {
            errorHandler(error);
        });
    }

    uploadImage(body, handleSuccess, errorHandler) {
        const file = new FormData();
        file.append("file", body);
        this.communication.postRequest("upload", file, (response) => {
            handleSuccess(response.data);
        }, (error) => {
            errorHandler(error);
        });
    }
}

export const dataService = new DataService();