import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {logout} from '../../../shared/auth';

import * as actionTypes from '../../../store/reducers/auth';
import * as siteActionTypes from '../../../store/reducers/site';
import * as categoryActionTypes from '../../../store/reducers/category';

class Logout extends Component {
    componentDidMount () {
        logout(this.props);
    }

    render () {
        this.props.onSetCategory(0);
        this.props.onFetchCategories([]);
        return <Redirect to="/sites"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch({
            type: actionTypes.AUTH_LOGOUT
          }),
        onSetCategory: (category) => dispatch({
            type: siteActionTypes.SET_CATEGORY,
            category:category
        }),
        onFetchCategories: (categories) => dispatch({
            type: categoryActionTypes.FETCH_CATEGORIES,
            categories: categories
        }),  
    };
};

export default connect(null, mapDispatchToProps)(Logout);