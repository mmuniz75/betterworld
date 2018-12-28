import React from 'react';

import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = ( props ) => (
    
    <header className="short-header">   

        <div className="gradient-block"></div>	

        <div className="row header-content">

            <div className="logo">
            <a href="index.html">Author</a>
            </div>

            <nav id="main-nav-wrap">
                <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin} isEditor={props.isEditor} />
            </nav>

            <div className="search-wrap">
                
                <form role="search" method="get" className="search-form" action="#">
                    <label>
                        <span className="hide-content">Search for:</span>
                        <input type="search" className="search-field" placeholder="Type Your Keywords" value="" name="s" title="Search for:" autoComplete="off" />
                    </label>
                    <input type="submit" className="search-submit" value="Search" />
                </form>

                <a href="#" id="close-search" className="close-btn">Close</a>

            </div>

            <div className="triggers">
                <a className="search-trigger" href="#"><i className="fa fa-search"></i></a>
                <a className="menu-toggle" href="#"><span>Menu</span></a>
            </div>
            
        </div>
    </header>
);

export default toolbar;

/*
        <nav classNameName={classNamees.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin} isEditor={props.isEditor} />
        </nav>
*/