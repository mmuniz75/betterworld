import React from 'react';

import classes from './SelectCategory.css';

const SelectCategory = (props) => (

        <div className={classes.MainSelection}>
            <select  onChange={props.changed} value={props.selected?props.selected:'0'}>
                <option value="0">Qual o seu interesse ?</option>
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