import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {bundle} from '../../shared/bundle';

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
                        drawerToggleClicked={this.sideDrawerToggleHandler} />
                    <SideDrawer
                        isAuth={this.props.isAuthenticated}
                        open={this.state.showSideDrawer}
                        closed={this.sideDrawerClosedHandler} />
                <main className={classes.Layout}>
                    <h1>{bundle('TITLE')}</h1>
                    <font color="white">
                    <p>
                        Assitindo as noticias na TV parece que o mundo não vai bem, mas isso não é a realidade, é apenas
                        uma pequena porcentagem, dos fatos que acontecem no mundo. 
                    </p>        
                    <p>
                        Nosso instinto de alerta frente as ameças faz com que mantermos o foco nos aspecto negativos, e a TV usa esse
                        nosso comportamento para criar seus programas. O efeito colateral disso é ter uma sociedade com medo e achar
                        que nada de bom acontece.
                    </p>                                
                    <p>
                        O objetivo desse site é dar um ponto de vista mais positivo para as pessoas vendo que temos muitas
                        iniciativas em todas as areas onde as pessoas estão fazendo a diferença e melhorando o mundo em que 
                        vivemos.
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