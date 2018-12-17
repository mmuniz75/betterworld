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
                <span  className={classes.Label}>{props.email} </span>({props.role})
                &nbsp;&nbsp;
                &nbsp;&nbsp;{saveLink}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                    <i className="fas fa-trash fa-lg" title='Remover usuario' />
                </a>
            </div>
        </Auxliary>
    )
}      

export default user;