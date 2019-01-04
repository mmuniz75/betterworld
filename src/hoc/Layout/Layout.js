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

    render () { 
        return (
            <Auxiliary>
                    <Toolbar
                        isAuth={this.props.isAuthenticated}
                        isAdmin={this.props.isAdmin}
                        isEditor={this.props.isEditor}
                        showSearch={this.props.history.location.pathname === '/sites'}
                        openSearch={this.searchOpendHandler}
                        isSearchOpen={this.state.isSearchOpen}
                        closeSearch={this.searchClosedHandler}
                        search={this.search}
                    />
                    
                <main>
                    {this.props.children}
                </main>

                <footer>
                    <div className="footer-bottom">
                    <div className="row">

                        <div className="col-twelve">
                            <div className="copyright">
                                <span>© Copyright 2019</span> 
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
        isEditor: state.auth.role === 'editor'
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