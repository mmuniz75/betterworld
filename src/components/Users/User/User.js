import React from 'react';

import classes from './User.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

const user = (props) => {

    const saveLink = props.auth && props.email && false
                      ?<Auxliary>
                        <a onClick={() => props.edit(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-edit fa-lg" title='Editar Usuario' />
                        </a>
                       </Auxliary> 
                      :null
    
    return (
        <Auxliary>
            <div className={classes.ProductDetails}>
                <span  className={classes.Label}>{props.email}</span>
                &nbsp;&nbsp;
                &nbsp;&nbsp;{saveLink}
            </div>
        </Auxliary>
    )
}      
// <span  className={classes.Label}>Ativo?</span><input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} />  
export default user;