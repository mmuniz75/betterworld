import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/reducers/user';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Users from '../../components/Users/Users';

import Bundle from '../../components/UI/Bundle/bundle';

import axios from '../../axios';
import classes from './Users.css';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';                                        

import {API_SERVER} from '../../shared/consts';

import resourceMessage from '../../shared/resourceMessage/resourceMessage';

const USERS_URL = `${API_SERVER}/users/`;

class UsersContainer extends Component {
        
    state = {
        loading : false,
        salved: false,
        deleteUserIndex: null
    }

    componentDidMount= () => {
        this.loadUsers();
    }

    loadUsers(){
        if(this.props.users.length===0) {
            this.setState({loading:true}); 
            axios.get(USERS_URL,{headers: {'access-token' : this.props.token}})
            .then(response => {
                const usersLoaded = [];
                Object.keys(response.data).map(key => {
                    const user = response.data[key];
                    if(user){
                        user.key = key;
                        usersLoaded.push(user)
                    } 
                    return usersLoaded;   
                });
                this.setState({loading:false});
                this.props.onFetchUsers(usersLoaded); 
           })
        }    
    }
   
    saveuser = (index,value) => {
        const usersLoaded = [...this.props.users];
        const user = usersLoaded[index];
        
        if(user.key) {
            user.index = index;
            this.updateuser(user);
        }else {
            this.adduser(user);
        }
    }
    
  
    addUser = () => {
        this.props.history.replace('/createUser');
    }

    removeUser = () => {
        const index = this.state.deleteUserIndex;
        this.setState({deleteUserIndex:null});
        const usersLoaded = [...this.props.users];
        const user = usersLoaded[index];
        this.props.onUserDelete(index);
        axios.delete(`${USERS_URL}${user.email}`,{headers: {'access-token' : this.props.token}})
    }

    cancelDelete = () =>{
        this.setState({deleteUserIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteUserIndex:index});
    }
    
    updateRole = (index,value) => {
        this.props.onUserUpdate(index,value);
        const usersLoaded = [...this.props.users];
        const user = usersLoaded[index];
        axios.patch(`${USERS_URL}${user.email}`,{role:value},{headers: {'access-token' : this.props.token}});
    }
    
    render(){
        let users = <Spinner />;                                        
        if ( !this.state.loading ) {
             users =   <Users   users={this.props.users}
                                delete={this.confirmDelete}
                                auth={this.props.isAuthenticated}
                                change={this.updateRole}
                                isAdmin={this.props.isAdmin}/>
             
        }
        
        return (
            <div className={classes.UsersContainer}>
                <div className={classes.Users}>
                    <a onClick={() => this.addUser()} style={{cursor: 'pointer'}} >
                                    <i className="fas fa-plus fa-lg" title={resourceMessage('USER_ADD')} />
                                </a>
                    <br/><br/>
                    {users}
                    <Modal show={this.state.deleteUserIndex!==null}>
                        <h3><Bundle message="USER_DEL_CONFIRM" /></h3>
                        <Button btnType="Success" clicked={this.removeUser}><Bundle message="YES" /></Button>
                        <Button btnType="Danger" clicked={this.cancelDelete}><Bundle message="NO" /></Button>
                    </Modal> 
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token,
        isAdmin : state.auth.role === 'admin',
        isAuthenticated: state.auth.token !== null,
        users: state.user.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUsers: (users) => dispatch({
            type: actionTypes.FETCH,
            users: users
        }),
        onUserUpdate: (index,role) => dispatch({
            type: actionTypes.UPDATE,
            index: index,
            role: role
        }),
        onUserDelete: (indexUser) => dispatch({
            type: actionTypes.DELETE,
            index: indexUser
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(UsersContainer,axios));
