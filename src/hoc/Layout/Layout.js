import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import * as actionTypes from '../../store/reducers/site';

class Layout extends Component {
    state = {
        showSideDrawer: false,
        isSearchOpen: false,
        isMenuOpen: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    searchClosedHandler = () => {
        this.setState( { isSearchOpen: false } );
    }

    search = (event) => {
        event.preventDefault();
        this.props.onFilterSites(event.target[0].value);
        this.setState( { isSearchOpen: false } );
    }


    searchOpendHandler = () => {
        this.setState( { isSearchOpen: true } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    closeSideDrawerToggleHandler = () => {
        this.setState( {showSideDrawer: false });
    }
    
    openMenu = () => {
        this.setState( {isMenuOpen: true } );
    }

    closeMenu = () => {
        this.setState( {isMenuOpen: false } );
    }

    render () { 
        return (
            <Auxiliary>
                    <Toolbar
                        isAuthenticated={this.props.isAuthenticated}
                        isAdmin={this.props.isAdmin}
                        isEditor={this.props.isEditor}
                        showSearch={this.props.history.location.pathname === '/sites'}
                        openSearch={this.searchOpendHandler}
                        isSearchOpen={this.state.isSearchOpen}
                        closeSearch={this.searchClosedHandler}
                        search={this.search}
                        showMenu={this.state.isMenuOpen}
                        openMenu={this.openMenu}
                        closeMenu={this.closeMenu}
                        categories={this.props.categories}
                        switchToggle={this.sideDrawerToggleHandler}
                        closeToggle={this.closeSideDrawerToggleHandler}
                        showSideDrawer={this.state.showSideDrawer}
                        
                    />
                    
                <main>
                    {this.props.children}
                </main>

                <footer>
                    <div className="footer-bottom">
                    <div className="row">

                        <div className="col-twelve">
                            <div className="copyright">
                                <span>© Copyright 2019 | v1.0</span> 
                                <span>Design by Muniz</span>		         	
                            </div>

                            <div id="go-top">
                            <a className="smoothscroll" title="Back to Top" href="#top"><i className="icon icon-arrow-up"></i></a>
                            </div>         
                        </div>

                    </div> 
                    </div>

                </footer>  
                
                <div id="preloader"> 
                    <div id="loader"></div>
                </div> 
            </Auxiliary>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isAdmin: state.auth.role === 'admin',
        isEditor: state.auth.role === 'editor',
        categories: state.category.categories,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFilterSites: (filterCriteria) => dispatch({
            type: actionTypes.FILTER_SITES,
            search:filterCriteria,
        }),
    };
};


export default  withRouter(connect( mapStateToProps,mapDispatchToProps )( Layout ));
