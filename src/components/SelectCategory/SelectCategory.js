import React from 'react';

import classes from './SelectCategory.css';

const SelectCategory = (props) => (

        <div className={classes.MainSelection}>
            <select  onChange={props.changed} value={props.selected?props.selected:'0'}>
                <option value="0">Escolha uma Categoria</option>
                {
                props.categories?     
                    props.categories.filter(category => {return category.active})
                    .map(category => {
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