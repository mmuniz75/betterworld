import React from 'react';

import classes from './SelectCategory.css';
import Bundle from '../../components/UI/Bundle/bundle';

const SelectCategory = (props) => (

        <div className={classes.MainSelection}>
            <select  onChange={props.changed} value={props.selected?props.selected:'0'}>
                <option value="0"><Bundle message="CATEGORY_TITLE" /></option>
                {
                props.categories?     
                    props.categories.map(category => {
                        return (
                            <option
                                key={category.id} 
                                value={category.id}>
                                {category.name}
                            </option>
                        )    
                    })
                    :null        }

            </select>
        </div>

)

export default SelectCategory; 