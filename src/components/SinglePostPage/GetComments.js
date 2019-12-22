import React from "react";
import { Link } from "react-router-dom";

import "./GetComments.css";

const GetComments = (props) => {
    const { comments } = props;

    return (
        <div>
            {comments.map((comment) => {
                return (
                    <div key={comment.id} className="card-block row GetComments_cardStyle">
                        <div className="col-sm-5 col-md-4 col-lg-3 col-xl-3">
                            <Link to={`/profile/${comment.authorId}`}>
                                <p className="GetComments_commentAuthorStyle">{comment.authorName}</p>
                            </Link>
                            <p className="GetComments_commentDateStyle" style={{ marginBottom: "0" }}>{new Date(comment.dateCreated).toLocaleDateString()}</p>
                            <p className="GetComments_commentDateStyle" >{`at ${new Date(comment.dateCreated).toLocaleTimeString()}`}</p>
                        </div>
                        <div className="col-sm-7 col-md-8 col-lg-9 col-xl-9">
                            <p style={{ fontSize: "1.2em", textAlign: "left", paddingLeft: "20px" }}> {comment.body}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default GetComments;