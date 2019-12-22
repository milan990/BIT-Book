import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Search.css";

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: ""
        };

        this.searchValue = this.searchValue.bind(this);
        this.handleSearchRequest = this.handleSearchRequest.bind(this);
    }

    searchValue(event) {
        this.setState({
            searchString: event.target.value
        });

        this.props.dispatch(event.target.value);
        this.props.filterResults(event.target.value);
    }


    handleSearchRequest() {
        this.props.dispatch(this.state.searchString);
    }

    render() {
        return (
            <input type="text" value={this.state.searchString} onChange={this.searchValue} placeholder={this.props.placeholder} className="form-control mr-sm-2 Search_searchStyle" />
        );
    }
}

Search.propTypes = {
    dispatch: PropTypes.func,
    filterResults: PropTypes.func
};