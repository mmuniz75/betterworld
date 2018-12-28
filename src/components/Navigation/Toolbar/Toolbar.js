import React from 'react';

import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = ( props ) => (
    
    <header class="short-header">   

        <div class="gradient-block"></div>	

        <div class="row header-content">

            <div class="logo">
            <a href="index.html">Author</a>
            </div>

            <nav id="main-nav-wrap">
                <ul class="main-navigation sf-menu">
                    <li><a href="index.html" title="">Home</a></li>									
                    <li class="has-children current">
                        <a href="category.html" title="">Areas</a>
                        <ul class="sub-menu">
                            <li><a href="category.html">Economy</a></li>
                            <li><a href="category.html">Health</a></li>
                            <li><a href="category.html">Food</a></li>
                            <li><a href="category.html">Transportation</a></li>
                            <li><a href="category.html">Power</a></li>
                            <li><a href="category.html">Ecology</a></li>
                        </ul>
                    </li>
                    <li><a href="single-standard.html" title="">Add Site</a></li>
                    <li><a href="style-guide.html" title="">Users</a></li>
                    <li><a href="about.html" title="">Areas Admin</a></li>	
                    <li><a href="contact.html" title="">Contact</a></li>										
                    <li><a href="contact.html" title="">Login</a></li>										
                </ul>
            </nav>

            <div class="search-wrap">
                
                <form role="search" method="get" class="search-form" action="#">
                    <label>
                        <span class="hide-content">Search for:</span>
                        <input type="search" class="search-field" placeholder="Type Your Keywords" value="" name="s" title="Search for:" autocomplete="off" />
                    </label>
                    <input type="submit" class="search-submit" value="Search" />
                </form>

                <a href="#" id="close-search" class="close-btn">Close</a>

            </div>

            <div class="triggers">
                <a class="search-trigger" href="#"><i class="fa fa-search"></i></a>
                <a class="menu-toggle" href="#"><span>Menu</span></a>
            </div>
            
        </div>
    </header>
);

export default toolbar;

/*
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin} isEditor={props.isEditor} />
        </nav>
*/