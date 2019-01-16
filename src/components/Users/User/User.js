import React from 'react';
import resourceMessage from '../../../shared/resourceMessage/resourceMessage';

const user = (props) => {

    const optionAdmin = props.isAdmin?
        <option value="admin">{resourceMessage("USER_ROLE_ADMIN")}</option>   
        :null;
  
    return (

        <tr>
            <td><span  >{props.email} </span></td>
            <td>
                <select defaultValue={props.role} onChange={(event) => props.change(props.index,event.target.value)}  >
                    <option value="disable">{resourceMessage("USER_ROLE_DISABLE")} </option>   
                    <option value="default">{resourceMessage("USER_ROLE_DEFAULT")} </option>   
                    <option value="editor">{resourceMessage("USER_ROLE_EDITOR")}</option> 
                    {optionAdmin}
                </select> 
            </td>
            <td><a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                    <i className="fas fa-trash fa-lg" title={resourceMessage('USER_DELETE')} />
                </a>
            </td>
        </tr>

    )
}      



export default user;
