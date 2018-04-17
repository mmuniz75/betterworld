import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.css';

const navigationItem = ( props ) => {
    const link = !props.emailLink?<NavLink 
                                    to={props.link}
                                    exact={props.exact}
                                    activeClassName={classes.active}>{props.children}
                                  </NavLink>
                 :<a href="mailto:betterworldemail@gmail.com" target="_top">{props.children}</a>                 
    
    return (
    <li className={classes.NavigationItem}>
        {link}
    </li>
    )
};

export default navigationItem;