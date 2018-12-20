import React from 'react';

import classes from './User.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

const user = (props) => {

    const optionAdmin = props.isAdmin?
        <option value="admin">{translateRole('admin')}</option>   
        :null;

    
    return (
        <Auxliary>
            <div className={classes.ProductDetails}>
                <span  className={classes.Label}>{props.email} </span>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <hr/>
                <select defaultValue={props.role} className={classes.InputElement} onChange={(event) => props.change(props.index,event.target.value)}  >
                    <option value="disable">{translateRole('disable')}</option>   
                    <option value="default">{translateRole('default')}</option>   
                    <option value="editor">{translateRole('editor')}</option> 
                    {optionAdmin}
                </select>    
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                    <i className="fas fa-trash fa-lg" title='Remover usuario' />
                </a>
            </div>
        </Auxliary>
    )
}      

const translateRole = (role) => {

    switch (role) {
        case 'admin':
            return 'Admistrador';
        case 'editor':
            return 'Editor';
        case 'disable':
            return 'Desativado';    
        default:
            return 'Colaborador'        
    }
}

export default user;
