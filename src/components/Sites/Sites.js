import React from 'react';

import classes from './Sites.css';

const Sites = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Sites}>
                    {props.sites?props.sites.map(site => {
                        return (
                            <li key={site.id}>
                                <div className={classes.ProductDetails}>
                                    <h2>{site.name}</h2>
                                    <p className={classes.ProductDescription}>{site.description}</p>
                                    <button onClick={() => window.open(site.site)}>Veja mais</button>
                                    {/*
                                    &nbsp;
                                    <button onClick={() => props.edit(site.id)}>Editar</button>
                                    */}
                                </div>
                            </li>
                        )
                        }      
                    ):null
                    }
            </ul>
)

export default Sites;