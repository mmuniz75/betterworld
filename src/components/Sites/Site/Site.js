import React from 'react';

import classes from './Site.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

const Site = (props) => {
        
    const image = props.logo? <a className={classes.ProductPhoto}>
                                <img src={props.logo} height="160" width="160" alt={props.site}/>
                            </a>
                    :null          

    return (
        <Auxliary>
            {image}
            <div className={classes.ProductDetails}>
                <h2>{props.name}</h2>
                <p className={classes.ProductDescription}>{props.description}</p>
                <button onClick={() => window.open(props.site)}>Veja mais</button>
                {/*
                &nbsp;
                <button onClick={() => props.edit(site.id)}>Editar</button>
                */}
            </div>
        </Auxliary>
    )
}      
export default Site;