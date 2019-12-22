import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import DataService from "../../services/DataService";
import RedirectionService from "../../services/RedirectionService";

import "./ProfilePage.css";
import "./EditProfilePageModalStyle.css";


const modalStyle = {
    content: {
        height: "8ProfilePage_error0%",
        maxWidth: "70%",
        margin: "0 auto",
        marginTop: "55px"
    }
};

export default class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            modalIsOpen: false,
            avatar: "",
            about: "",
            aboutShort: "",
            comments: 0,
            email: "",
            posts: "",
            newName: "",
            newAbout: "",
            newAboutShort: "",
            newEmail: "",
            newAvatarUrl: "",
            error: "",
            isThereError: false,
            uploadImageError: false,
            uploadedImage: "",
            successfulUpload: false,
            imageSelectedForUpload: false
        };

        this.getData = new DataService();
        this.redirect = new RedirectionService();

        this.initBind();
    }

    initBind() {
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.collectFieldValue = this.collectFieldValue.bind(this);
        this.displayModal = this.displayModal.bind(this);
        this.displayEditProfileButton = this.displayEditProfileButton.bind(this);
        this.getMyProfile = this.getMyProfile.bind(this);
        this.getOtherProfile = this.getOtherProfile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.informUser = this.informUser.bind(this);
    }

    componentDidMount() {
        let userId = this.props.match.params.id;
        if (userId) {
            this.getOtherProfile(userId);
        } else {
            this.getMyProfile();
        }
    }

    getOtherProfile(id) {
        this.getData.getSingleUserData(user => {
            this.setState({
                name: user.name,
                avatar: user.avatarUrl,
                about: user.about,
                aboutShort: user.aboutShort,
                commentsCount: user.commentsCount,
                email: user.email,
                posts: user.postsCount
            });
        }, id);

    }

    getMyProfile() {
        this.getData.getProfileData(profile => {
            console.log(profile);
            this.setState({
                name: profile.name,
                avatar: profile.avatarUrl,
                about: profile.about,
                aboutShort: profile.aboutShort,
                posts: profile.postsCount,
                comments: profile.commentsCount,
                email: profile.email
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        const userId = nextProps.match.params.id;
        if (userId) {
            this.getOtherProfile(userId);
        } else {
            this.getMyProfile();
        }
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    collectFieldValue(e) {
        const value = e.target.value;
        const fieldName = e.target.name;

        this.setState({
            [fieldName]: value
        });
    }

    updateProfile() {
        let newName;
        let newAbout;
        let newAvatarUrl;
        let newAboutShort;
        let newEmail;

        this.state.newName
            ? (newName = this.state.newName)
            : (newName = this.state.name);
        this.state.newAbout
            ? (newAbout = this.state.newAbout)
            : (newAbout = this.state.about)
                ? (newAbout = this.state.about)
                : (newAbout = "This user hasn't written anything about him/herself");
        this.state.newAvatarUrl
            ? (newAvatarUrl = this.state.newAvatarUrl)
            : this.state.uploadedImage
                ? (newAvatarUrl = this.state.uploadedImage)
                : (newAvatarUrl = this.state.avatar);
        this.state.newAboutShort
            ? (newAboutShort = this.state.newAboutShort)
            : (newAboutShort = this.state.aboutShort)
                ? (newAboutShort = this.state.aboutShort)
                : (newAboutShort = "This user hasn't written anything about him/herself");
        this.state.newEmail
            ? (newEmail = this.state.newEmail)
            : (newEmail = this.state.email);

        const newProfileData = {
            name: newName,
            about: newAbout,
            aboutShort: newAboutShort,
            avatarUrl: newAvatarUrl,
            email: newEmail
        };

        this.getData.updateProfileData(newProfileData, error => {
            this.setState({
                isThereError: true,
                successfulUpload: false
            });
        });
    }

    uploadImage() {
        const file = document.querySelector("#file").files[0];

        this.getData.uploadImage(
            file,
            response => {
                this.setState({
                    uploadedImage: response,
                    successfulUpload: true,
                    imageSelectedForUpload: false
                });
            },
            error => {
                if (error.error === "Please Upload a image.") {
                    this.setState({
                        uploadImageError: true
                    })
                }
            }
        );
    }

    informUser() {
        document.querySelector("#file").addEventListener("change", () => {
            this.setState({
                imageSelectedForUpload: true
            });
        });
    }

    displayModal() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Example Modal"
                    style={modalStyle}
                    ariaHideApp={false}
                >
                    <nav className="navbar navbar-expand-lg navbar-light modalNavColor">
                        <h2 className="ProfilePage_updateProfileHeading">Update Profile</h2>
                    </nav>
                    <div className="row">
                        <div className="ProfilePage_modalCardStyle">
                            <form>
                                <div>
                                    <input
                                        type="text"
                                        value={this.state.name}
                                        onChange={this.collectFieldValue}
                                        name="name"
                                        placeholder="Enter a new name"
                                        className="form-control form-control-lg ProfilePage_formInputElement"
                                        required
                                    />
                                    <input
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.collectFieldValue}
                                        name="email"
                                        placeholder={`Current email: ${this.state.email}`}
                                        className="form-control form-control-lg ProfilePage_formInputElement"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={this.state.aboutShort
                                            ? this.state.aboutShort
                                            : "Enter a short description"
                                        }
                                        onChange={this.collectFieldValue}
                                        name="aboutShort"
                                        className="form-control form-control-lg ProfilePage_formInputElement"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={this.state.avatarUrl}
                                        onChange={this.collectFieldValue}
                                        name="avatar"
                                        id="avatarURL"
                                        placeholder="Enter new avatar url"
                                        className="form-control form-control-lg ProfilePage_formInputElement"
                                        required
                                    />
                                </div>
                                <div className="ProfilePage_uploadButtonsDiv">
                                    <input
                                        type="file"
                                        onClick={this.informUser}
                                        name="file"
                                        id="file"
                                        className="form-control-file ProfilePage_chooseFileButtonStyle"
                                    />
                                    <label
                                        htmlFor="file"
                                        className="btn ProfilePage_mockChooseFileButton col-6 col-sm-6 col-md-5 col-lg-4 col-xl-3"
                                    >
                                        Find File
                                    </label>
                                    <input
                                        type="button"
                                        onClick={this.uploadImage}
                                        value="Upload"
                                        id="upload"
                                        className="ProfilePage_chooseFileButtonStyle"
                                    />
                                    <label
                                        htmlFor="upload"
                                        className="btn ProfilePage_mockChooseFileButton col-6 col-sm-5 col-md-5 col-lg-4 col-xl-3"
                                    >
                                        Upload
                                    </label>
                                </div>
                                {this.state.imageSelectedForUpload ? <p className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-4" style={{ margin: "0 auto" }}>Image successfully selected!</p> : ""}
                                {this.state.successfulUpload ? <p className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-4" style={{ margin: "0 auto" }}>Image successfully uploaded!</p> : ""}
                                {this.state.uploadImageError ? <p className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-4" style={{ margin: "0 auto" }}>Please upload an image!</p> : ""}
                                <textarea
                                    value={this.state.about
                                        ? this.state.about
                                        : "Say something about yourself"
                                    }
                                    onChange={this.collectFieldValue}
                                    name="about"
                                    rows="5"
                                    className="updateProfileForm form-control"
                                    required
                                />
                                <div className="ProfilePage_closeUpdateButtonsDiv">
                                    <input
                                        type="button"
                                        value="Close"
                                        onClick={this.closeModal}
                                        className="btn ProfilePage_uploadButtonStyle ProfilePage_closeButton col-12 col-sm-12 col-md-4 offset-md-4 col-lg-3 offset-6 col-xl-3 offset-6"
                                    />
                                    <input
                                        type="button"
                                        value="Update"
                                        onClick={this.updateProfile}
                                        className="btn ProfilePage_uploadButtonStyle col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
                                    />
                                </div>
                                <p className="ProfilePage_error">
                                    {this.state.isThereError
                                        ? "Error: All inputs must be filled"
                                        : ""}
                                </p>
                            </form>
                        </div>
                        <div className="col-2" />
                    </div>
                </Modal>
            </div>
        );
    }

    displayEditProfileButton() {
        return (
            <input
                type="button"
                value="Edit Profile"
                onClick={this.openModal}
                className="btn col-6 offset-3 ProfilePage_editProfileButtonStyle"
            />
        );
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div
                        className="col-12 col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3"
                        style={{ marginTop: "55px" }}
                    >
                        <div className="card ProfilePage_cardStyle">
                            <div
                                className="card-img-top ProfilePage_imgStyle"
                                style={{
                                    backgroundImage:
                                        this.state.avatar ? `url(${this.state.avatar})` : "url('http://via.placeholder.com/200x200?text=No%20User%20Image')",
                                    backgroundSize: "200px"
                                }}
                            />
                            <div className="card-block">
                                <h2 className="card-title ProfilePage_userName">
                                    {this.state.name}
                                </h2>
                                <div className="ProfilePage_postsAndCommentsInfo">
                                    <p className="btn ProfilePage_userDataInfo">
                                        Posts: {this.state.posts ? this.state.posts : "0"}
                                    </p>
                                    <p className="btn ProfilePage_userDataInfo">
                                        Comments: {this.state.comments ? this.state.comments : "0"}
                                    </p>
                                </div>
                                {this.props.match.params.id
                                    ? ""
                                    : this.displayEditProfileButton()}
                                {this.state.aboutShort
                                    ? <p className="card-text">{this.state.aboutShort}</p>
                                    : ""
                                }
                                {this.state.about === "This user hasn't written anything about him/herself" || this.state.about === "Nothing yet"
                                    ? ""
                                    : <p className="card-text" style={{ marginBottom: "20px" }}>{this.state.about}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.match.params.id ? "" : this.displayModal()}
            </div>
        );
    }
}

UserProfile.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object
};