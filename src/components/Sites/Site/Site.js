import React from 'react';
import Auxliary from '../../../hoc/Auxiliary/Auxiliary';
import Bundle from '../../UI/Bundle/bundle';
import resourceMessage from '../../../shared/resourceMessage/resourceMessage';
import Button from '../../../components/UI/Button/Button';

const Site = (props) => {
    
    const approvation = props.approveClicked && props.rejectClicked;
    
    const buttons = approvation
                    ?<Auxliary>
                        <Button btnType="Success"
                                clicked={() => props.approveClicked(props.index)}
                                ><Bundle message="SITE_APPROVE" /></Button>
                        &nbsp;
                        <Button btnType="Danger"
                                clicked={() => props.rejectClicked(props.index)}
                                ><Bundle message="SITE_REJECT" /></Button>
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
                        <span><input type="checkbox" checked={props.active} onChange={() => props.enable(props.index)} /><Bundle message="SITE_ENABLE" /></span>
                        :null

    const location = props.location                  
                     ?<i>({props.location})</i>
                     :null
    return (

        <article class="brick entry format-standard animate-this">

            <div class="entry-thumb">
                <a href={props.site} target="_blank" class="thumb-link">
                    <img src={props.logo} alt={props.site} height="650" width="1300"/>             
                </a>
            </div>

            <div class="entry-text">
                <div class="entry-header">

                    <div class="entry-meta">
                        <span class="cat-links">
                        {editButton}
                        {deleteButton}
                        {enableCheck}              				
                        </span>			
                    </div>

                    <h1 class="entry-title"><a target="_blank" href={props.site}>{props.name}</a></h1>{categoryLabel}
                    
                </div>
                        <div class="entry-excerpt">
                        {props.description}
                        <p>{location}</p>
                        <br/><br/>
                        {buttons}
                        </div>
            </div>

        </article>


        
    )
}      
export default Site;

/*
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
                
            </div>
        </Auxliary>

*/