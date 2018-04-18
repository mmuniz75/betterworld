import React from 'react';

import classes from './Sites.css';
import Site from './Site/Site';

const Sites = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Sites}>
                    {
                        props.sites?props.sites.map(site => {
                           return (    
                                <li key={site.id}>
                                    <Site logo={site.logo} 
                                    name={site.name} 
                                    description={site.description} 
                                    site={site.site} />
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)

export default Sites;