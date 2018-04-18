import React from 'react';

import classes from './Sites.css';
import Site from './Site/Site';

const Sites = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Sites}>
                    {
                        props.sites?props.sites.map( (site,index) => {
                           return (    
                                <li key={site.id}>
                                    <Site logo={site.logo} 
                                    id={site.id}
                                    name={site.name} 
                                    description={site.description} 
                                    site={site.site}
                                    index={index}
                                    buttonsType={props.buttonsType} 
                                    approveClicked={props.approveClicked}
                                    rejectClicked={props.rejectClicked}
                                    category={site.category}/>
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)

export default Sites;