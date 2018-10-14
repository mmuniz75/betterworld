import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './containers/Home/Home';
import Layout from './hoc/Layout/Layout';

import asyncComponent from './hoc/asyncComponent/asyncComponent';

import {authCheckState} from './shared/auth'

import * as actionTypes from './store/reducers/auth';

const asyncSiteData = asyncComponent(() => {
  return import('./containers/SiteData/SiteData');
});

const asyncCategory = asyncComponent(() => {
  return import('./containers/CategoriesAdmin/CategoriesAdmin');
});

const asyncCategoryData = asyncComponent(() => {
  return import('./containers/CategoryData/CategoryData');
});

const asyncLogin = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

const asyncLogout = asyncComponent(() => {
  return import('./containers/Auth/Logout/Logout');
});

const asyncSugest = asyncComponent(() => {
  return import('./containers/SiteSugest/SiteSugest');
});

class App extends Component {

  componentDidMount () {
    authCheckState(this.props);
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/categories" exact component={asyncCategory} />
        <Route path="/categoryData" exact component={asyncCategoryData} />
        <Route path="/sites" exact component={Home} />
        <Route path="/" exact component={Home} />
        <Route path="/siteData" exact component={asyncSiteData} />
        <Route path="/login" exact component={asyncLogin} />
        <Route path="/logout" exact component={asyncLogout} />
        <Route path="/sugest" exact component={asyncSugest} />
        <Redirect to="/sites" />
      </Switch>
    );

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onAuth: ( token, userId ) => dispatch( {
                                           type: actionTypes.AUTH_SUCCESS,
                                           idToken: token,
                                           userId: userId
                                          }),
      onLogout: () => dispatch( {
                                  type: actionTypes.AUTH_LOGOUT
                                } ),
  };
};



export default withRouter(connect( mapStateToProps,mapDispatchToProps )(App)) ;

