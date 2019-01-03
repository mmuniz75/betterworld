import React from 'react';

import resourceMessage from '../../shared/resourceMessage/resourceMessage';

const SelectCategory = (props) => (

        <div>
            <select  onChange={props.changed} value={props.selected?props.selected:'0'}>
                <option value="0">{resourceMessage("CATEGORY_TITLE")}</option>
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