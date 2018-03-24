import React from 'react';

import './SelectCategory.css';

const SelectCategory = (props) => (
    <select className="SelectCategory">
        {props.categories.map(category => {
                return (
                    <option key={category.id} value={category.id}>{category.name}</option>
                )    
            })
        }
    </select>

)

export default SelectCategory; 