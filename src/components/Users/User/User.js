import React from 'react';

import classes from './User.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

import resourceMessage from '../../../shared/resourceMessage/resourceMessage';
import Bundle from '../../UI/Bundle/bundle';

const user = (props) => {

    const optionAdmin = props.isAdmin?
        <option value="admin"><Bundle message="USER_ROLE_ADMIN" /></option>   
        :null;

    
    return (
        <Auxliary>
            <div className={classes.ProductDetails}>
                <span  className={classes.Label}>{props.email} </span>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <hr/>
                <select defaultValue={props.role} className={classes.InputElement} onChange={(event) => props.change(props.index,event.target.value)}  >
                    <option value="disable"><Bundle message="USER_ROLE_DISABLE" /></option>   
                    <option value="default"><Bundle message="USER_ROLE_DEFAULT" /></option>   
                    <option value="editor"><Bundle message="USER_ROLE_EDITOR" /></option> 
                    {optionAdmin}
                </select>    
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                    <i className="fas fa-trash fa-lg" title={resourceMessage('USER_DELETE')} />
                </a>
            </div>
        </Auxliary>
    )
}      



export default user;
