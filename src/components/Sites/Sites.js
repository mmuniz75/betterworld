import React from 'react';

import Site from './Site/Site';

const Sites = (props) => (

    <div className="bricks-wrapper" style={!props.show?{display:'none'}:null}>
        <div className="grid-sizer"></div>

        {
            props.sites?props.sites.map( (site,index) => {

                let categoryName = null; 
                           
                if(props.categories && props.categories.length > 0 && site.category!=="") { 
                    const copyCateotires = [...props.categories];   
                    const category = copyCateotires.filter(cat => cat.id === site.category);
                    categoryName = category[0].name; 
                } 

                return (

                    <Site 
                            key={site.id}
                            logo={site.logo} 
                            id={site.id}
                            name={site.name} 
                            description={site.description} 
                            category={categoryName}
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
