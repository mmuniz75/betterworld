import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './containers/Home/Home';
import Layout from './hoc/Layout/Layout';

import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncSiteData = asyncComponent(() => {
  return import('./containers/SiteData/SiteData');
});

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/siteData" exact component={asyncSiteData} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

export default App;
