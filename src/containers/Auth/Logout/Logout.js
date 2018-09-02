import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {logout} from '../../../shared/auth';

import * as actionTypes from '../../../store/reducers/auth';
import * as siteActionTypes from '../../../store/reducers/site';

class Logout extends Component {
    componentDidMount () {
        logout(this.props);
    }

    render () {
        this.props.onSetCategory(0);
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
        })
    };
};

export default connect(null, mapDispatchToProps)(Logout);