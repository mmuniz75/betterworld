import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {logout} from '../../../shared/auth';

import * as actionTypes from '../../../store/reducers/auth';

class Logout extends Component {
    componentDidMount () {
        logout(this.props);
    }

    render () {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch({
            type: actionTypes.AUTH_LOGOUT
          })
    };
};

export default connect(null, mapDispatchToProps)(Logout);