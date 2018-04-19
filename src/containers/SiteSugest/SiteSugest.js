import React,{Component} from 'react';
import { connect } from 'react-redux';

import Sites from '../../components/Sites/Sites';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';

import axios from '../../axios';

import classes from './SiteSugest.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_SUGEST_URL} from '../../shared/consts';

import * as siteActionTypes from '../../store/reducers/site';

class SiteSugest extends Component {
        
    state = {
        loading : false,
        noResults : true
    }

    componentWillMount= () => {
        if(this.props.suggestions.length === 0) {
            this.loadSugestion();    
        }    
    }

    loadSugestion = () => {
        this.setState({loading:true});
        axios.get(SITES_SUGEST_URL+".json")
        .then(response => {
            const sitesLoaded = [];
            if(response.data) {
                Object.keys(response.data).map(key => {
                    const site = response.data[key];
                    site.id = key;
                    return sitesLoaded.push(site)
                });
            }    
            this.props.onFetchSuggestions(sitesLoaded);
            this.setState({loading:false}); 
        })
    }

    reject = (index) => {
        this.setState({loading:true}); 
        const sitesLoaded = [...this.props.suggestions];
        const site = sitesLoaded[index];
        axios.delete(SITES_SUGEST_URL+'/' + site.id + '.json')
        .then(response => {
            sitesLoaded.splice(index,1);
            this.props.onFetchSuggestions(sitesLoaded);
            this.setState({loading:false}); 
        })
    } 
    

    approve = (index) => {
        this.setState({loading:true}); 
        const sitesLoaded = [...this.props.suggestions];
        const site = sitesLoaded[index];
        
        this.props.onSiteApprove(site);
        this.props.history.replace('/siteData');
        /*
        axios.post(SITES_URL + '?auth=' + this.props.token,site)
        .then(response => {
            axios.delete(SITES_SUGEST_URL+'/' + site.id + '.json')
            .then(response => {
                sitesLoaded.splice(index,1);
                this.setState({loading:false,sites:sitesLoaded}); 
            })

        } )
        */
    }

    messageConfirmedHandler = () => {
        this.setState( { noResults: null } );
        this.props.history.replace('/sites');
    }

    render(){

        let sites = <Spinner />;
        if ( !this.state.loading ) {

            if (this.props.suggestions && this.props.suggestions.length === 0) { 
                sites = <Modal
                            show={this.state.noResults}
                            modalClosed={this.messageConfirmedHandler}>
                            Nenhum site foi sugerido
                        </Modal>
            }else {
                sites = <Sites show 
                            sites={this.props.suggestions} 
                            rejectClicked={this.reject}
                            approveClicked={this.approve}
                             />
            }                

        }
        
        
        return (
            <div className={classes.Home}>
                {sites}
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token,
        suggestions : state.site.suggestionsLoaded
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSiteApprove: (siteToApprove) => dispatch({
            type: siteActionTypes.SITE_APPROVE,
            site: siteToApprove
        }),
        onFetchSuggestions: (suggestionsLoaded) => dispatch({
            type: siteActionTypes.FETCH_SUGGESTIONS,
            suggestions: suggestionsLoaded,
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(SiteSugest,axios));