import React from 'react';

import classes from './Sites.css';
import Site from './Site/Site';

const Sites = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Sites}>
                    {
                        props.sites?props.sites.map( (site,index) => {

                           let categoryName = null; 
                           
                           if(props.categories && props.categories.length > 0 && site.category!="") { 
                            const copyCateotires = [...props.categories];   
                            const category = copyCateotires.filter(cat => cat.id === site.category);
                            categoryName = category[0].name; 
                           } 
                           
                           return (    
                                <li key={site.id}>
                                    <Site logo={site.logo} 
                                    id={site.id}
                                    name={site.name} 
                                    description={site.description} 
                                    site={site.site}
                                    location={site.location}
                                    active={site.active}
                                    index={index}
                                    buttonsType={props.buttonsType} 
                                    approveClicked={props.approveClicked}
                                    rejectClicked={props.rejectClicked}
                                    category={categoryName}
                                    edit={props.edit}
                                    delete={props.delete}
                                    canDelete={props.canDelete}
                                    canEdit={props.canEdit || props.userId===site.userId}
                                    auth={props.auth}
                                    enable={props.enable}
                                    />
                                    
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)

export default Sites;