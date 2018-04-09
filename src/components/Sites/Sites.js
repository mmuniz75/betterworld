import React from 'react';

import classes from './Sites.css';

const Sites = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Sites}>
                    {props.sites?props.sites.map(site => {
                        return (
                            <li key={site.nome}>
                                <div className={classes.ProductDetails}>
                                    <h2>{site.nome}</h2>
                                    <p className={classes.ProductDescription}>{site.descrição}</p>
                                    <button onClick={() => window.open(site.site)}>Veja mais</button>
                                </div>
                            </li>
                        )
                        }      
                    ):null
                    }
            </ul>
)

export default Sites;