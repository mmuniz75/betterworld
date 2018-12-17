import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/reducers/user';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Users from '../../components/Users/Users';

import axios from '../../axios';
import classes from './Users.css';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';                                        

import {messages,API_SERVER} from '../../shared/consts';

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
                        return usersLoaded.push(user)
                    }    
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
    
    
    render(){
        let users = <Spinner />;                                        
        if ( !this.state.loading ) {
             users =   <Users   users={this.props.users}
                                delete={this.confirmDelete}
                                auth={this.props.isAuthenticated}/>
             
        }
        
        return (
                <div className={classes.Users}>
                    <a onClick={() => this.addUser()} style={{cursor: 'pointer'}} >
                                    <i className="fas fa-plus fa-lg" title='Adicionar Usuario' />
                                </a>
                    <br/><br/>
                    {users}
                    <Modal show={this.state.deleteUserIndex!==null}>
                        <h3>Confirma remoção da Usuario ?</h3>
                        <Button btnType="Success" clicked={this.removeUser}>SIM</Button>
                        <Button btnType="Danger" clicked={this.cancelDelete}>NÃO</Button>
                    </Modal> 
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token,
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
        onUserUpdate: (userToUpdate) => dispatch({
            type: actionTypes.UPDATE,
            userData: userToUpdate
        }),
        onUserDelete: (indexUser) => dispatch({
            type: actionTypes.DELETE,
            index: indexUser
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(UsersContainer,axios));