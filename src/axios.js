import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://bestworld-eaa92.firebaseio.com/'
});

export default instance;