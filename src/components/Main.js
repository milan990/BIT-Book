import React from "react";
import { Switch, Route } from "react-router-dom";

import Header from "./common/Header";
import UserProfile from "./ProfilePage/ProfilePage";
import People from "./PeoplePage/People";
import Feed from "./FeedPage/Feed";
import SinglePostInfo from "./SinglePostPage/SinglePostInfo";

const Main = () => {
    return (
        <div className="row">
            <Header />
            <Switch>
                <Route exact path="/profile" component={UserProfile} />
                <Route path="/profile/:id" component={UserProfile} />
                <Route exact path="/people" component={People} />
                <Route path="/feed" component={Feed} />
                <Route path="/:type/:id" component={SinglePostInfo} />
            </Switch>
        </div>
    );
}

export default Main;