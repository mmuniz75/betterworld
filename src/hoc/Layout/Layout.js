import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Bundle from '../../components/UI/Bundle/bundle';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
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
                    />
                    
                <main>
                    {this.props.children}
                </main>

                <footer>
                    <div class="footer-bottom">
                    <div class="row">

                        <div class="col-twelve">
                            <div class="copyright">
                                <span>© Copyright 2019</span> 
                                <span>Design by Muniz</span>		         	
                            </div>

                            <div id="go-top">
                            <a class="smoothscroll" title="Back to Top" href="#top"><i class="icon icon-arrow-up"></i></a>
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

export default connect( mapStateToProps )( Layout );