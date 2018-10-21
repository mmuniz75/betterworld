import React from 'react';

import classes from './Category.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

import Input from '../../UI/Input/Input';

const category = (props) => {
    
    const deleteLink = props.auth
                      ?<Auxliary>
                        <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-trash fa-lg" title='Remover Categoria' />
                        </a>
                       </Auxliary> 
                      :null
    return (
        <Auxliary>
            <div className={classes.ProductDetails}>
                <input type='text' placeholder='Categoria' value={props.name} className={classes.InputElement} 
                onBlur={(event) => props.edit(props.index,event.target.value)} 
                onChange={(event) => props.change(props.index,event.target.value)}/>
                &nbsp;&nbsp;
                <span  className={classes.Label}>Ativa?</span><input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} />
                &nbsp;&nbsp;{deleteLink}
                <p className={classes.ProductDescription}>{props.description}</p>
            </div>
        </Auxliary>
    )
}      
export default category;