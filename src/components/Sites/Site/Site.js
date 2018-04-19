import React from 'react';

import classes from './Site.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

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
                                >Approve</button>
                        &nbsp;
                        <button className={classes.ButtonReject}
                                onClick={() => props.rejectClicked(props.index)}
                                >Reject</button>
                    </Auxliary>
                    :null;

    const categoryLabel = approvation?'(' + props.category + ')':null;                
    const editLinks = props.auth
                      ?<a onClick={() => props.edit(props.index)} style={{cursor: 'pointer'}} >
                        <i class="fas fa-edit fa-lg" alt='Editar' />
                       </a>
                      :null
                   
    return (
        <Auxliary>
            {image}
            <div className={classes.ProductDetails}>
                <h2>{props.name}</h2>
                <br/>
                {editLinks}
                <h3>{categoryLabel}</h3>
                <p className={classes.ProductDescription}>{props.description}</p>
                <button className={classes.RegularButton} 
                          onClick={() => window.open(props.site)}>Veja mais</button>   
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