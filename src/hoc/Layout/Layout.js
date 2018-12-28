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
                    
                <main className={classes.Layout}>
                    <h1><Bundle message="TITLE" /></h1>
                    <font color="white">
                    <p>
                    <Bundle message="PARAGRAPH1" />
                    </p>        
                    <p>
                    <Bundle message="PARAGRAPH2" />                        
                    </p>                                
                    <p>
                    <Bundle message="PARAGRAPH3" />                        
                    </p>    
                    </font>
                    {this.props.children}
                </main>
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