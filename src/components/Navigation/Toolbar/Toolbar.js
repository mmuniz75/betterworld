import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import resourceMessage from '../../../shared/resourceMessage/resourceMessage';

const toolbar = ( props ) => (

        <header className="short-header">   

            <div className="gradient-block"></div>	

            <div className="row header-content">

                <div className="logo">
                    <a href="/home">Best World</a>
                </div>

                <div className="main-title-wrap">
                    Best World
                </div>
                
                <nav id="main-nav-wrap">
                    
                    <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin} isEditor={props.isEditor} />
                </nav>

                <div className="search-wrap" style={{opacity:props.isSearchOpen?1:0,visibility:props.isSearchOpen?'visible':'hidden'}} >
                    
                    <form className="search-form" onSubmit={props.search} >
                        <label>
                            <span className="hide-content">Search for:</span>
                            <input type="search" placeholder={resourceMessage("SITE_FILTER")} name="s" title="Search for:" autoComplete="off" />
                        </label>
                        <input type="submit" className="search-submit" value="Search" />
                        <div className="search-tip" >{resourceMessage("SITE_FILTER_TIP")}</div>
                    </form>

                    
                    
                    <a id="close-search" className="close-btn" onClick={props.closeSearch}>Close</a>

                </div>

                <div className="triggers">
                    <a className="search-trigger" onClick={props.openSearch} style={{cursor:'pointer',display: props.showSearch?'inline':'none'}}><i className="fa fa-search"></i></a>
                    <a className="menu-toggle" ><span>Menu</span></a>
                </div>
                
            </div>

        </header>
)


export default toolbar;

/*
        <nav classNameName={classNamees.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} isAdmin={props.isAdmin} isEditor={props.isEditor} />
        </nav>
*/