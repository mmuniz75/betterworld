import React from 'react';

import classes from './Sites.css';
import Site from './Site/Site';

const Sites = (props) => (

    <div class="bricks-wrapper" style={!props.show?{display:'none'}:null}>
        <div class="grid-sizer"></div>

        {
            props.sites?props.sites.map( (site,index) => {

                return (

                    <Site 
                            key={site.id}
                            logo={site.logo} 
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
                            edit={props.edit}
                            delete={props.delete}
                            canDelete={props.canDelete}
                            canEdit={props.canEdit || props.userId===site.userId}
                            auth={props.auth}
                            enable={props.enable}
                    />
                    )
            })
            :null
            }    
            
    </div>  
 
)

export default Sites;
