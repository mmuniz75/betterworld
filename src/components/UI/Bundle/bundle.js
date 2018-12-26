import React from 'react';

import {messages} from './messages';
import {messagesEn} from './messages_EN';

const bundle = (props) => {
    const language = window.navigator.userLanguage || window.navigator.language;
    let message = null;
    if(language.substring(0,2)==='pt')
        message = messages[props.message];
    else 
        message = messagesEn[props.message];   
    
    return (
        <span>{message}</span>
    )    
}

export default bundle;