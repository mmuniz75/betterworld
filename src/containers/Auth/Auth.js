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
import * as siteActionTypes from '../../store/reducers/site';
import * as categoryActionTypes from '../../store/reducers/category';

import { updateObject, checkValidity } from '../../shared/utility';

import {messages} from '../../shared/consts';

const AUTH_URL = 'http://bestworld-security.herokuapp.com/login/';

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


    getRoleElement = () => {
        return {
            role: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: '0',
                validation: {
                    required: true,
                },
                valid: true
            }
        }
    }

    isCreation = () => {
        return this.props.location.pathname === '/createUser' && this.props.isAuthenticated && (this.props.isAdmin || this.props.isEditor);
    }

    componentDidMount = () => {

        if(!this.isCreation()) {
            return;
        }

        const roleOptions =  [
              {
                value:'default',
                displayValue:'Colaborador',
              },
              {
                value:'editor',
                displayValue:'Editor',
              }
            ];
        
        if(this.props.isAdmin){
            roleOptions.push({
                value:'admin',
                displayValue:'Admistrator',
              });
        }    

        const roleFormElement = {
                               role: {
                                    elementType: 'select',
                                    elementConfig: {
                                        options: roleOptions
                                    },
                                    value: 'default',
                                    validation: {
                                        required: true,
                                    },
                                    valid: true
                                }
        };

        const updatedAuthForm = updateObject(this.state.controls, {
            role: roleFormElement
        });
        this.setState({ controls : updatedAuthForm});
       
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
            user: email,
            password: password
        };
                    
        axios.post(AUTH_URL, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.id);
                this.props.onAuth(response.data.token, response.data.id,response.data.role );
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
        const isCreation = this.isCreation();
        
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
                value={!isCreation?formElement.config.value:""}
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
            console.log(this.state.error);
            const message = messages[this.state.error]?messages[this.state.error]:messages['GENERIC_ERROR']; 
            errorMessage = (
                <p>{message}</p>
                
            );
        }

        let authRedirect = null;
        if ( this.props.isAuthenticated && !isCreation) {
            this.props.onSetCategory(0);
            this.props.onFetchCategories([]);
            authRedirect = <Redirect to='/sites' />
        }

        return (
                <Modal show>
                <div className={classes.Auth}>
                    <h3>{!isCreation?'Login':'Criar Usuário'}</h3>
                    {authRedirect}
                    {errorMessage}
                    <form onSubmit={this.submitHandler}>
                        {form}
                        <Button btnType="Success">{!isCreation?'Logar':'Salvar'}</Button>
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
        isAdmin: state.auth.role === 'admin',
        isEditor: state.auth.role === 'editor'
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( token, userId, role ) => dispatch( {
                                             type: actionTypes.AUTH_SUCCESS,
                                             idToken: token,
                                             userId: userId,
                                             role: role
                                            }),
        onLogout: () => dispatch( {
                                    type: actionTypes.AUTH_LOGOUT
                                  } ),
        
        onSetCategory: (category) => dispatch({
            type: siteActionTypes.SET_CATEGORY,
            category:category
        }),
        onFetchCategories: (categories) => dispatch({
            type: categoryActionTypes.FETCH_CATEGORIES,
            categories: categories
        }),                                  
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );