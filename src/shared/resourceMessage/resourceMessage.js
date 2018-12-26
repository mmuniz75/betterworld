import {messages} from './messages';
import {messagesEn} from './messages_EN';

const resourceMessage = (key) => {
    const language = window.navigator.userLanguage || window.navigator.language;
    let message = null;
    if(language.substring(0,2)==='pt')
        message = messages[key];
    else 
        message = messagesEn[key];   
    
    return message;
}

export default resourceMessage;