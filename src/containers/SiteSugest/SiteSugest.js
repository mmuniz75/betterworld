import React,{Component} from 'react';


import Sites from '../../components/Sites/Sites';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios';

import classes from './SiteSugest.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_SUGEST_URL} from '../../shared/consts';


class SiteSugest extends Component {
        
    state = {
        sites : null,
        loading : false
    }

    componentDidMount= () => {
        this.loadSugestion();    
    }

    loadSugestion = () => {
        this.setState({loading:true});
        axios.get(SITES_SUGEST_URL)
        .then(response => {
            const sitesLoaded = [];
            Object.keys(response.data).map(key => {
                return sitesLoaded.push(response.data[key])
            });
            this.setState({sites:sitesLoaded ,loading:false}); 
        })
    }


    render(){

        let sites = <Spinner />;
        if ( !this.state.loading ) {
            sites = <Sites show sites={this.state.sites} />
        }    
        return (
            <div className={classes.Home}>
                {sites}
            </div>
            
        )
    }
}

export default withErrorHandler(SiteSugest,axios);