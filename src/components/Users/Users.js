import React from 'react';

import classes from './Users.css';
import User from './User/User';

const Users = (props) => (
        <ul style={!props.users?{display:'none'}:null} className={classes.Users}>
                    {
                        props.users?props.users.map( (user,index) => {
                           return (    
                                <li key={index}>
                                    <User
                                        email={user.email}
                                        index={index}
                                        auth={props.auth}
                                        role={user.role}
                                        delete={props.delete}
                                        change={props.change}
                                    />
                                    
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)


export default Users;