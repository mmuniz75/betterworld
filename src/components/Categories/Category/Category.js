import React from 'react';

import classes from './Category.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

import Bundle from '../../../components/UI/Bundle/bundle';
import resourceMessage from '../../../shared/resourceMessage/resourceMessage';


const category = (props) => {

    const saveLink = props.auth && props.name
                      ?<Auxliary>
                        <a onClick={() => props.save(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-save fa-lg" title={resourceMessage('CATEGORY_SAVE')} />
                        </a>
                       </Auxliary> 
                      :null
    
    const deleteLink = props.auth 
                      ?<Auxliary>
                        <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-trash fa-lg" title={resourceMessage('CATEGORY_DELETE')} />
                        </a>
                       </Auxliary> 
                      :null
    return (
        <Auxliary>
            <div className={classes.ProductDetails}>
                <input type='text' placeholder='Categoria' value={props.name} className={classes.InputElement} 
                onChange={(event) => props.change(props.index,event.target.value)}/>
                &nbsp;&nbsp;
                <span  className={classes.Label}><Bundle message="CATEGORY_ACTIVE" /></span><input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} />
                &nbsp;&nbsp;{saveLink}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{deleteLink}
                <p className={classes.ProductDescription}>{props.description}</p>
            </div>
        </Auxliary>
    )
}      
export default category;