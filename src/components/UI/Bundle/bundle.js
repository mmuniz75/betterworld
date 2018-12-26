import React from 'react';

import resourceMessage from '../../../shared/resourceMessage/resourceMessage';

const bundle = (props) => (
        <span>{resourceMessage(props.message)}</span>
);    


export default bundle;