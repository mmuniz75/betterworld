import React,{Component} from 'react';
import { connect } from 'react-redux';
import Sites from '../../components/Sites/Sites';
import * as categoryActionTypes from '../../store/reducers/category';
import * as siteActionTypes from '../../store/reducers/site';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Bundle from '../../components/UI/Bundle/bundle';
import resourceMessage from '../../shared/resourceMessage/resourceMessage';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import axios from '../../axios';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_URL} from '../../shared/consts';
const sitesURL = SITES_URL + '.json?orderBy="category"&equalTo=';

class Site extends Component {
    
    unlisten = null;
    
    componentWillUnmount() {
       this.unlisten();
    }

    state = {
        sites : null,
        loading : false,
        categoryLoading: false,
        deleteSiteIndex : null
    }

    componentDidMount= () => {
        
        this.unlisten = this.props.history.listen((location, action) => {
            this.checkLoadSites(location);
        });

        this.checkLoadSites(this.props.history.location);
    }

    checkLoadSites = (location) => {
        const category = location.search.substring(1);

        if(category !== "" && category !== this.props.lastCategory)
            this.loadSites(category);

    }
  

    loadSites = (category) => {
        this.setState({loading:true});
        axios.get(sitesURL + '"' + category + '"')
        .then(response => {
            const sitesLoaded = [];
            Object.keys(response.data).map(key => {
                const site = response.data[key];
                if(this.props.isAuthenticated || site.active) {
                    site.key = key;
                    sitesLoaded.push(site)
                }
                return null;    
            });
            this.props.onFetchSites(sitesLoaded,category);
            
            if(this.props.lastFilter && this.props.lastFilter.length > 0) {
                this.props.onFilterSites(this.props.lastFilter);
            }  

            this.setState({loading:false}); 
        })
    }

    editSite = (index) => {
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        site.index = index;
        this.props.onSiteEdit(site);
        this.props.history.push('/siteData');
    }

    enableSite = (index) => {
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        site.index = index;
        site.active = !site.active;
        this.updateSite(site);
    }

    removeSite = () => {
        const index = this.state.deleteSiteIndex;
        this.setState({deleteSiteIndex:null});
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        this.props.onDeleteSite(site.key);

        axios.post(SITES_URL+ '_trash.json?auth=' + this.props.token ,site)
        .then(response => {
            axios.delete(SITES_URL+'/' + site.key + '.json?auth=' + this.props.token)
        })
    }

    cancelDelete = () =>{
        this.setState({deleteSiteIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteSiteIndex:index});
    }

    updateSite = (site) => {
        const url = SITES_URL+ '/' + site.key + '.json?auth=' + this.props.token ;
        
        axios.put(url ,site)
                .then( response => {
                    this.setState({loading:false});
                    if (response) {
                       this.props.onUpdateSite(site);
                    }    
        } )
    }

    render(){
       
        let sites = <Spinner />;

        let categoryName = null; 
        
                           
        if(this.props.categories && this.props.categories.length > 0 && this.props.lastCategory!=="") { 
         const copyCateotires = [...this.props.categories];   
         const category = copyCateotires.filter(cat => cat.id === this.props.lastCategory);
         if(category.length > 0)
            categoryName = category[0].name; 
        } 

        let filtered = null;
        if(this.props.lastFilter && this.props.lastFilter.length > 0){
           filtered = <font color="red"> / {resourceMessage('SITE_FILTERED')} : {this.props.lastFilter}</font>;
        }

        if ( !this.state.loading ) {
            sites = <Auxiliary>
                        <Sites 
                            sites={this.props.lastSitesLoaded}
                            edit={this.editSite}
                            delete={this.confirmDelete}
                            canDelete={this.props.canDelete}
                            canEdit={this.props.canEdit}
                            auth={this.props.isAuthenticated}
                            enable={this.enableSite}
                            userId={this.props.userId}
                            />
                            
                    </Auxiliary>        
        }    
        return (
            <div >
                <section id="page-header">
                    <div className="row current-cat">
                        <div className="col-full">
                            <h1>Area: {categoryName}{filtered}</h1>
                        </div>   		
                    </div>
                </section>

                <section id="bricks" className="with-top-sep">

                    <div className="row masonry">
                       {sites}
                    </div>
                
                </section>


                <Modal show={this.state.deleteSiteIndex!==null}>
                    <h3><Bundle message="SITES_DELETE_MESSAGE" /></h3>
                    <Button btnType="Success" clicked={this.removeSite}><Bundle message="YES" /></Button>
                    <Button btnType="Danger" clicked={this.cancelDelete}><Bundle message="NO" /></Button>
                </Modal>    
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        token : state.auth.token,
        canDelete : state.auth.role === 'admin',
        canEdit : state.auth.role === 'admin' || state.auth.role === 'editor',
        userId : state.auth.userId,
        lastSitesLoaded : state.site.lastSitesLoaded,
        lastCategory : state.site.category,
        isAuthenticated: state.auth.token !== null,
        lastFilter : state.site.filterCriteria,
        sitesCashed : state.site.sitesCashed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategories: (categories) => dispatch({
            type: categoryActionTypes.FETCH,
            categories: categories
        }),
        onFetchSites: (sitesLoaded,selectedCategory) => dispatch({
            type: siteActionTypes.FETCH_SITES,
            sites: sitesLoaded,
            category : selectedCategory
        }),
        onSiteEdit: (siteToEdit) => dispatch({
            type: siteActionTypes.SITE_EDIT,
            site:siteToEdit
        }),
        onSetCategory: (category) => dispatch({
            type: siteActionTypes.SET_CATEGORY,
            category:category
        }),
        onDeleteSite: (siteKey) => dispatch({
            type: siteActionTypes.DELETE_SITE,
            key: siteKey
        }),
        onFilterSites: (filterCriteria) => dispatch({
            type: siteActionTypes.FILTER_SITES,
            search:filterCriteria,
        }),
        onUpdateSite: (site) => dispatch({
            type: siteActionTypes.UPDATE_SITE,
            site: site
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Site,axios));
