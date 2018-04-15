import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        {props.isAuthenticated ? <NavigationItem link="/">Sites</NavigationItem> : null}
        {props.isAuthenticated ? <NavigationItem link="/SiteData">Adicionar Site</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">Login</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;