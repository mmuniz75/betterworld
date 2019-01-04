import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import Bundle from '../../UI/Bundle/bundle';

const navigationItems = ( props ) => (

    <ul className="main-navigation sf-menu">

        <NavigationItem link="/home"><Bundle message="NAV_HOME" /></NavigationItem> 

        <NavigationItem link="/sites" {...props} listLink><Bundle message="CATEGORY_TITLE" /></NavigationItem> 

        {props.isAuthenticated 
            ? <NavigationItem link="/siteData"><Bundle message="NAV_ADD_SITE" /></NavigationItem> 
            : <NavigationItem link="/siteData"><Bundle message="NAV_SITE_SUGGESTION" /></NavigationItem> }
        {props.isAuthenticated 
            ? <NavigationItem link="/sugest"><Bundle message="NAV_SITE_SUGGESTIONS" /></NavigationItem> 
            : null} 
        {props.isAdmin || props.isEditor
            ? <NavigationItem link="/users"><Bundle message="NAV_USERS" /></NavigationItem> 
            : null} 
        {props.isAdmin
            ? <NavigationItem link="/categories"><Bundle message="NAV_CATEGORY" /></NavigationItem> 
            : null} 
        {!props.isAuthenticated
            ? <NavigationItem emailLink ><Bundle message="NAV_CONTACT" /></NavigationItem>
            : null }
        {!props.isAuthenticated
            ? <NavigationItem link="/login"><Bundle message="NAV_LOGIN" /></NavigationItem>
            : <NavigationItem link="/logout"><Bundle message="NAV_LOGOUT" /></NavigationItem>}
    </ul>
    
);

export default navigationItems;
