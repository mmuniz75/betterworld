import React from 'react';

import classes from './SelectCategory.css';

const SelectCategory = (props) => (
        <div className={classes.MainSelection}>
            <select  onChange={props.changed}>
                <option value="0">Escolha uma Categoria</option>
                {
                props.categories?     
                    props.categories.map(category => {
                        const selected = category.name===props.selected?true:false;
                        return (
                            <option selected={selected} 
                                key={category.id} 
                                value={category.name}>
                                {category.name}
                            </option>
                        )    
                    })
                    :null        }

            </select>
        </div>
)

export default SelectCategory; 