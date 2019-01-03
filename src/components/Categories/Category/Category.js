import React from 'react';

import classes from './Category.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';
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
        <tr>
            <td>
                <input type='text' placeholder='Categoria' value={props.name}  
                onChange={(event) => props.change(props.index,event.target.value)}/>
            </td>
            <td>
                <input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} />
            </td>
            <td>{saveLink}</td>
            <td>{deleteLink}</td>   
        </tr>
    )
}      
export default category;