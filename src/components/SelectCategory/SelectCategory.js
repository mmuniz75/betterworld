import React from 'react';

import './SelectCategory.css';

const SelectCategory = (props) => (
    <select className="SelectTest" onChange={props.changed}>
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

)

export default SelectCategory; 