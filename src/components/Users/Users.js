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
                                        active={user.active}
                                        index={index}
                                        auth={props.auth}
                                        enable={props.enable}
                                    />
                                    
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)

export default Users;