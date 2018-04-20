import React from 'react';

import classes from './SearchText.css';

const SelectCategory = (props) => {

        const inputStyle = props.show?classes.Display:classes.Hidden;

        return (
            <div className={classes.Border}>
                <div className={classes.SearchText}>
                    <input type="text" 
                        className={inputStyle}
                        placeholder={props.placeholder} 
                        onChange={props.changed}/>
                </div>
            </div>
        )
}

export default SelectCategory; 