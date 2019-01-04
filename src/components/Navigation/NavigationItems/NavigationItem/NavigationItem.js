import React from 'react';
import { NavLink } from 'react-router-dom';

import Auxiliary from '../../../../hoc/Auxiliary/Auxiliary';

let showMenu = false;


const navigationItem = ( props ) => {
    const link = props.emailLink?
                        <a href="mailto:betterworldemail@gmail.com" target="_top">{props.children}</a>
                :!props.listLink?
                    <NavLink 
                    to={props.link}
                    exact={props.exact}
                    activeClassName="current"
                    >{props.children}
                    </NavLink>

                 : <Auxiliary>
                    <a href="category.html" onMouseOver={props.switchMenu}  >Areas</a>
                    <ul id="subMenu" className="sub-menu" style={{display:props.showMenu?'inline':'none'}} onMouseLeave={props.switchMenu}>
                    {
                        props.categories.map(category => {
                            return (
                                <li key={category.id}>
                                    <NavLink to={`${props.link}?${category.id}`} exact activeClassName="current" >
                                        {category.name}
                                    </NavLink>
                                </li>
                            )    
                        })
                    }
                    </ul>
                   </Auxiliary>                
    
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