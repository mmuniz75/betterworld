import React from 'react';

import classes from './Categories.css';
import Category from './Category/Category';

const categories = (props) => (
        <ul style={!props.show?{display:'none'}:null} className={classes.Categories}>
                    {
                        props.categories?props.categories.map( (category,index) => {
                           return (    
                                <li key={category.id}>
                                    <Category 
                                        name={category.name} 
                                        active={category.active}
                                        index={index}
                                        edit={props.edit}
                                        delete={props.delete}
                                        auth={props.auth}
                                    />
                                    
                                </li>
                                )
                        })
                                    :null
                    }
        </ul>
)

export default categories;