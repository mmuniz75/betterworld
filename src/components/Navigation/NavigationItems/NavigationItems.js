import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        {props.isAuthenticated 
            ? <NavigationItem link="/sites">Sites</NavigationItem> 
            : null}    
        {props.isAuthenticated 
            ? <NavigationItem link="/siteData">Adicione um Site</NavigationItem> 
            : <NavigationItem link="/siteData">Sugira um Site</NavigationItem> }
        {props.isAuthenticated 
            ? <NavigationItem link="/sugest">Sugestões de Site</NavigationItem> 
            : null} 
        {props.isAdmin || props.isEditor
            ? <NavigationItem link="/createUser">Adicione um usuario</NavigationItem> 
            : null} 
        {props.isAdmin
            ? <NavigationItem link="/categories">Categorias</NavigationItem> 
            : null} 
        {!props.isAuthenticated
            ? <NavigationItem emailLink >Fale Conosco</NavigationItem>
            : null }
        {!props.isAuthenticated
            ? <NavigationItem link="/login">Login</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;