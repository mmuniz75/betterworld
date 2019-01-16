import React from 'react';

import Bundle from '../../components/UI/Bundle/bundle';
import User from './User/User';

const Users = (props) => (

    <table style={!props.users?{display:'none'}:null}>
        <thead>
        <tr>
            <th><Bundle message="USER_HEADER_NAME" /></th>
            <th><Bundle message="USER_HEADER_ROLE" /></th>
            <th><Bundle message="USER_HEADER_DELETE" /></th>
        </tr>
        </thead>
        <tbody>
        {
            props.users?props.users.map( (user,index) => {
                return (    
                        <User
                            key={index}
                            email={user.email}
                            index={index}
                            auth={props.auth}
                            role={user.role}
                            delete={props.delete}
                            change={props.change}
                            isAdmin={props.isAdmin}
                        />
                    )
            })
            :null
        }
        </tbody>
    </table>
       
)


export default Users;

/*
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
                                        isAdmin={props.isAdmin}
                                    />
                                    
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
*/        