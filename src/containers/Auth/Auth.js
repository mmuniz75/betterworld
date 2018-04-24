import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';

import {checkAuthTimeout} from '../../shared/auth';

import classes from './Auth.css';
import * as actionTypes from '../../store/reducers/auth';
import { updateObject, checkValidity } from '../../shared/utility';

const AUTH_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCEZ0Vr-6LjTQkji4xZuA79_LI_d6tNmUc';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Senha'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true,
        loading : false,
        error: null
    }

    
    inputChangedHandler = ( event, controlName ) => {
        const updatedControls = updateObject( this.state.controls, {
            [controlName]: updateObject( this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity( event.target.value, this.state.controls[controlName].validation ),
                touched: true
            } )
        } );
        this.setState( { controls: updatedControls } );
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.auth( this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup );
    }

    auth = (email, password) => {
        this.setState({loading:true});
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        //let new_user_url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDBu0iJZdxv9QYssqaADenC747Bwg4J2bA';
            
        axios.post(AUTH_URL, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                this.props.onAuth(response.data.idToken, response.data.localId);
                checkAuthTimeout(this.props,response.data.expiresIn);
                this.setState({loading:false});
            })
            .catch(err => {
                this.setState({loading:false,error:err.response.data.error});
            });
      
    };

    cancelLogin = (event) => {
        event.preventDefault();
        this.props.history.goBack();
    }
    
    render () {
        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }

        let form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )} />
        ) );

        if ( this.state.loading ) {
            form = <Spinner />
        }

        let errorMessage = null;

        if ( this.state.error ) {
            errorMessage = (
                <p>{this.state.error.message}</p>
            );
        }

        let authRedirect = null;
        if ( this.props.isAuthenticated ) {
            authRedirect = <Redirect to='/sites' />
        }

        return (
                <Modal show>
                <div className={classes.Auth}>
                    <h3>Login</h3>
                    {authRedirect}
                    {errorMessage}
                    <form onSubmit={this.submitHandler}>
                        {form}
                        <Button btnType="Success">Logar</Button>
                        <Button btnType="Danger" clicked={this.cancelLogin}>Cancelar</Button>
                    </form>
                </div>
                </Modal>
            
        );
    }
}



const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( token, userId ) => dispatch( {
                                             type: actionTypes.AUTH_SUCCESS,
                                             idToken: token,
                                             userId: userId
                                            }),
        onLogout: () => dispatch( {
                                    type: actionTypes.AUTH_LOGOUT
                                  } ),
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );