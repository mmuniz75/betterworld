import React from 'react';

import classes from './Site.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';
import Bundle from '../../UI/Bundle/bundle';
import resourceMessage from '../../../shared/resourceMessage/resourceMessage';

const Site = (props) => {
    
    const approvation = props.approveClicked && props.rejectClicked;

    const image = props.logo? <a className={classes.ProductPhoto}>
                                <img src={props.logo} height="160" width="160" alt={props.site}/>
                            </a>
                    :null          
    
    const buttons = approvation
                    ?<Auxliary>
                        <button className={classes.ButtonApprove}
                                onClick={() => props.approveClicked(props.index)}
                                ><Bundle message="SITE_REJECT" /></button>
                        &nbsp;
                        <button className={classes.ButtonReject}
                                onClick={() => props.rejectClicked(props.index)}
                                ><Bundle message="SITE_APPROVE" /></button>
                    </Auxliary>
                    :null;

    const categoryLabel = approvation
                            ?<Auxliary>
                                   (<b><Bundle message="SITE_CATEGORY" />:&nbsp;</b>{props.category})
                            </Auxliary>
                            :null;          
                                
    const editButton = props.canEdit && !approvation
                      ?<a onClick={() => props.edit(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-edit fa-lg" title={resourceMessage('SITE_EDIT')} />
                        </a>
                      :null;

    const deleteButton = props.canDelete && !approvation
                       ?<a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-trash fa-lg" title={resourceMessage('SITE_DELETE')} />
                        </a>
                      :null

    const enableCheck = props.canEdit && !approvation
                        ?
                        <p className={classes.ProductDescription}><input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} /><Bundle message="SITE_ENABLE" /></p>
                        :null

    const location = props.location                  
                     ?<i>({props.location})</i>
                     :null
    return (
        <Auxliary>
            {image}
            <div className={classes.ProductDetails}>
                <h2>{props.name}</h2>
                <br/>
                {editButton}
                &nbsp;&nbsp;&nbsp;
                {deleteButton}
                &nbsp;&nbsp;&nbsp;
                {enableCheck}
                {categoryLabel}
                <p className={classes.ProductDescription}>{props.description}</p>
                <p className={classes.Location}>{location}</p>
                <br/>
                <button className={classes.RegularButton} 
                          onClick={() => window.open(props.site)}><Bundle message="SITE_DETAIL" /></button>   
                <br/><br/>
                {buttons}
                
                {/*
                &nbsp;
                <button onClick={() => props.edit(site.id)}>Editar</button>
                */}
            </div>
        </Auxliary>
    )
}      
export default Site;