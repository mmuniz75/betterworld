import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import Bundle from '../../UI/Bundle/bundle';

const navigationItems = ( props ) => (

    <ul className="main-navigation sf-menu sf-js-enabled mobile" style={props.showSideDrawer?{touchAction: 'pan-y', display: 'block'}:null} >

        <NavigationItem link="/home" {...props}><Bundle message="NAV_HOME" /></NavigationItem> 

        <NavigationItem link="/sites" {...props} listLink><Bundle message="CATEGORY_TITLE" /></NavigationItem> 

        {props.isAuthenticated 
            ? <NavigationItem link="/siteData" {...props}><Bundle message="NAV_ADD_SITE" /></NavigationItem> 
            : <NavigationItem link="/siteData" {...props}><Bundle message="NAV_SITE_SUGGESTION" /></NavigationItem> }
        {props.isAuthenticated 
            ? <NavigationItem link="/sugest" {...props}><Bundle message="NAV_SITE_SUGGESTIONS" /></NavigationItem> 
            : null} 
        {props.isAdmin || props.isEditor
            ? <NavigationItem link="/users" {...props}><Bundle message="NAV_USERS" /></NavigationItem> 
            : null} 
        {props.isAdmin || props.isEditor
            ? <NavigationItem link="/categories" {...props}><Bundle message="NAV_CATEGORY_ADMIN" /></NavigationItem> 
            : null} 
        {!props.isAuthenticated
            ? <NavigationItem emailLink {...props}><Bundle message="NAV_CONTACT" /></NavigationItem>
            : null }
        {!props.isAuthenticated
            ? <NavigationItem link="/login" {...props}><Bundle message="NAV_LOGIN" /></NavigationItem>
            : <NavigationItem link="/logout" {...props}><Bundle message="NAV_LOGOUT" /></NavigationItem>}
    </ul>
    
);

export default navigationItems;
