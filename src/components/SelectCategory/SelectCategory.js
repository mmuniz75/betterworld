import React from 'react';

import classes from './SelectCategory.css';

const SelectCategory = (props) => (
    <div className={classes.SelectCategory}>
        <h1>Vejam inicativas que ajudam a tornar o mundo melhor</h1>
        
        <div className={classes.MainSelection}>
            <select  onChange={props.changed}>
                <option defaultValue value="0">Escolha uma Categoria</option>
                {
                props.categories?     
                    props.categories.map(category => {
                        return (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        )    
                    })
                    :null        }

            </select>
        </div>
        
    </div>

)

export default SelectCategory; 