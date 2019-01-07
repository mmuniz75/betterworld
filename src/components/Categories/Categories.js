import React from 'react';

import Category from './Category/Category';
import Bundle from '../../components/UI/Bundle/bundle';

const categories = (props) => (

        <table style={!props.show?{display:'none'}:null}>
        <thead>
        <tr>
            <th><Bundle message="CATEGORY_HEADER_NAME" /></th>
            <th><Bundle message="CATEGORY_HEADER_ENABLE" /></th>
            <th><Bundle message="CATEGORY_HEADER_SAVE" /></th>
            <th><Bundle message="CATEGORY_HEADER_DELETE" /></th>
        </tr>
        </thead>
        <tbody>
    
                    {
                        props.categories?props.categories.map( (category,index) => {
                           return (    
                                    <Category 
                                        key={index}
                                        name={category.name} 
                                        active={category.active}
                                        index={index}
                                        save={props.save}
                                        change={props.change}
                                        delete={props.delete}
                                        auth={props.auth}
                                        enable={props.enable}
                                    />
                                )
                        })
                                    :null
                    }
        </tbody>
    </table>
)

export default categories;