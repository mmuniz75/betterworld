import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.css';

const navigationItem = ( props ) => {
    const link = !props.emailLink?<NavLink 
                                    to={props.link}
                                    exact={props.exact}
                                    >{props.children}
                                  </NavLink>
                 :<a href="mailto:betterworldemail@gmail.com" target="_top">{props.children}</a>                 
    
    return (
    <li >
        {link}
    </li>
    )
};

export default navigationItem;

/*
<li className="has-children current">
            <a href="category.html" title="">Areas</a>
            <ul className="sub-menu">
                <li><a href="category.html">Economy</a></li>
                <li><a href="category.html">Health</a></li>
                <li><a href="category.html">Food</a></li>
                <li><a href="category.html">Transportation</a></li>
                <li><a href="category.html">Power</a></li>
                <li><a href="category.html">Ecology</a></li>
            </ul>
        </li>
        */