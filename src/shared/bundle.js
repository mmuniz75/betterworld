import {messages} from './messages';
import {messagesEn} from './messages_EN';

export const bundle = (key) => {
    const language = window.navigator.userLanguage || window.navigator.language;
    if(language.substring(0,2)==='pt')
        return messages[key];
    else 
        return messagesEn[key];   
}