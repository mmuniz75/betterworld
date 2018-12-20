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
import * as userActionTypes from '../../store/reducers/user';

import { updateObject, checkValidity } from '../../shared/utility';

import {messages,API_SERVER} from '../../shared/consts';

const AUTH_URL = `${API_SERVER}/login/`;
const USERS_URL = `${API_SERVER}/users/`;

let HEADER = null;

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
            },
            hidden: {}
        },
        loading : false,
        error: null,
    }

    isCreation = () => {
        return this.props.location.pathname === '/createUser' && this.props.isAuthenticated && (this.props.isAdmin || this.props.isEditor);
    }

    componentDidMount = () => {
        this.HEADER = {
                headers: { 'access-token' : this.props.token }  
            }

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
                displayValue:'Administrator',
              });
        }    

        const roleFormElement = {
                                elementType: 'select',
                                elementConfig: {
                                    options: roleOptions
                                },
                                value: 'default',
                                validation: {
                                    required: true,
                                },
                                valid: true
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
        this.setState({error:null});

        if(!this.isCreation())
            this.auth( this.state.controls.email.value, this.state.controls.password.value);
        else    
            this.create( this.state.controls.email.value, this.state.controls.password.value,this.state.controls.role.value);
    }

    auth = (email, password) => {
        this.setState({loading:true});
        const authData = {
            user: email,
            password: password
        };
                    
        axios.post(AUTH_URL, authData,)
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
                const message = err.response && err.response.data && err.response.data.error?err.response.data.error:err.message;
                this.setState({loading:false,error:message});
            });
      
    };

    create = (email, password, role) => {
        this.setState({loading:true});
        const authData = {
            user: email,
            password: password,
            role: role
        };
                    
        axios.post(USERS_URL, authData,this.HEADER)
            .then(response => {
                this.setState({loading:false});
                authData.key = response.data.id;
                authData.email = email;
                this.props.onAddUser(authData);
                this.props.history.replace('/users');
            })
            .catch(err => {
                this.setState({loading:false,error:err.response.data.error});
            });
      
    };

    cancelLogin = (event) => {
        event.preventDefault();
        if(this.isCreation())
            this.props.history.replace('/users');
        else    
            this.props.history.goBack();
    }


    resetPassword = () =>{
        this.setState({error:null});
        const email = this.state.controls['email'].value;
        if(!email || !this.state.controls['email'].valid) {
            this.setState({error:'EMAIL_EMPTY'});
            return;
        }
        
        this.setState({loading:true});
        axios.post(`${USERS_URL}${email}/password/reset`)
            .then(response => {
                this.setState({loading:false});
                this.props.history.replace('/');
            })
            .catch(err => {
                this.setState({loading:false,error:err.response.data.error});
            });
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
            console.log(this.state.error);
            if(this.state.error.indexOf(":") > 0)
                this.state.error = this.state.error.substring(0,this.state.error.indexOf(":")-1)

            const message = messages[this.state.error]?messages[this.state.error]:messages['GENERIC_ERROR']; 
            errorMessage = (
                <p><font color="red">{message}</font></p>
                
            );
        }

        let authRedirect = null;
        if ( this.props.isAuthenticated && !isCreation) {
            this.props.onSetCategory(0);
            this.props.onFetchusers([]);
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
                        <Button btnType="Success">{!isCreation?'Logar':'Criar'}</Button>
                        <Button btnType="Danger" clicked={this.cancelLogin}>Cancelar</Button>

                    </form>
                    <a onClick={() => this.resetPassword()} style={{cursor: 'pointer'}}><font size='1' color="blue">Esqueci minha senha</font> </a>
                </div>
                </Modal>
            
        );
    }
}



const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isAdmin: state.auth.role === 'admin',
        isEditor: state.auth.role === 'editor',
        token: state.auth.token
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
        onFetchusers: (users) => dispatch({
            type: userActionTypes.FETCH,
            users: users
        }),
        onAddUser: (user) => dispatch({
            type: userActionTypes.ADD,
            userData: user
        })                                  

    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );