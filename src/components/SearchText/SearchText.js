import React from 'react';

import classes from './SearchText.css';

const SelectCategory = (props) => {

        const inputStyle = props.show?classes.Display:classes.Hidden;
        const value = props.value?props.value:'';

        return (
            <div className={classes.Border}>
                <div className={classes.SearchText}>
                    <input type="text" 
                        className={inputStyle}
                        placeholder={props.placeholder} 
                        onChange={(event) => props.changed(event)}
                        value={value}/>
                </div>
            </div>
        )
}

export default SelectCategory; 