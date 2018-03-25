import React from 'react';

import './Sites.css';

const Sites = (props) => (

       <ul style={!props.show?{display:'none'}:null} className="product-list-vertical">
                {props.sites?props.sites.map(site => {
                    return (
                        <li key={site.nome}>
                            <div className="product-details">
                                <h2>{site.nome}</h2>
                                <p className="product-description">{site.descrição}</p>
                                <button onClick={() => window.open(site.site)}>More info</button>
                            </div>
                        </li>
                    )
                    }      
                  ):null
                }
        </ul>
   
)

export default Sites;