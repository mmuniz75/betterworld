import React from 'react';
import { NavLink } from 'react-router-dom';

import Auxiliary from '../../../../hoc/Auxiliary/Auxiliary';
import Bundle from '../../../UI/Bundle/bundle';


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
                    
                    <NavLink className="sf-with-ul" onMouseOver={props.openMenu} onMouseLeave={props.closeMenu} onClick={(event) => event.preventDefault()} to={props.link} exact activeClassName="current">
                        <Bundle message="NAV_CATEGORY" />
                    </NavLink>
                    <ul id="subMenu" className="sub-menu" style={{display:props.showMenu?'block':'none'}} onMouseLeave={props.closeMenu} onMouseOver={props.openMenu}>
                    {
                        props.categories.map(category => {
                            return (
                                <li key={category.id}>
                                    <NavLink to={`${props.link}?${category.id}`} exact activeClassName="current" onClick={props.closeMenu}>
                                        {category.name}
                                    </NavLink>
                                </li>
                            )    
                        })
                    }
                    </ul>
                   </Auxiliary>                
    
    return (
        <li className={props.listLink?"has-children sfHover":null}>
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