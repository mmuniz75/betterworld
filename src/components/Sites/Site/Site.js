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
                   
    return (
        <Auxliary>
            {image}
            <div className={classes.ProductDetails}>
                <h2>{props.name}&nbsp;{categoryLabel}</h2>
                <p className={classes.ProductDescription}>{props.description}</p>
                <button className={classes.RegularButton} 
                          onClick={() => window.open(props.site)}>Veja mais</button>   
                &nbsp;
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