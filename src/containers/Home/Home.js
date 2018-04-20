import React,{Component} from 'react';
import { connect } from 'react-redux';
import SelectCategory from '../../components/SelectCategory/SelectCategory';
import SearchText from '../../components/SearchText/SearchText'
import Sites from '../../components/Sites/Sites';
import * as categoryActionTypes from '../../store/reducers/category';
import * as siteActionTypes from '../../store/reducers/site';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

import axios from '../../axios';

import classes from './Home.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_URL} from '../../shared/consts';

import {like} from '../../shared/utility';


const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';
const categoriesURL = '/categories.json?orderBy="active"&equalTo=true';
const sitesURL = SITES_URL + '.json?orderBy="category"&equalTo=';

class Home extends Component {
        
    state = {
        sites : null,
        loading : false,
        categoryLoading: false,
        showSites : false,
        deleteSiteIndex : null
    }

    componentDidMount= () => {
        this.loadCategories();
        //this.loadSitesFromSpreedSheet();
        this.setState({showSites :this.props.lastSitesLoaded && this.props.lastCategory!==0});
    }
    

    loadSitesFromSpreedSheet(){
        if(!this.state.sites) {
            window.Tabletop.init( { key: publicSpreadsheetUrl,
                            callback: this.importData,
                            simpleSheet: true } )
        }  
    }

    loadCategories(){
        if(this.props.categories.length===0) {
            this.setState({categoryLoading:true}); 
            axios.get(categoriesURL)
            .then(response => {
                const categoriesLoaded = [];
                Object.keys(response.data).map(key => {
                    return categoriesLoaded.push(response.data[key])
                }

                );
                this.props.onFetchCategories(categoriesLoaded);
                this.setState({categoryLoading:false}); 
            })
        }
    }

    importData = (data, tabletop) => {
        //this.setState({sites:data})
        //axios.post('/sites.json?auth=' + this.props.token,data);
    }

    showSitesHandler = (event) => {
        this.props.onSetSitesFilter(null,null);
        const category = event.target.value;
        if (category==='0'){
            this.setState({showSites:false});
            this.props.onSetCategory(0);
        }else { 
           if(category!==this.props.lastCategory){
               this.loadSites(category);
           }
           this.setState({showSites:true}); 
        }    
    }

    loadSites = (category) => {
        this.setState({loading:true});
        axios.get(sitesURL + '"' + category + '"')
        .then(response => {
            const sitesLoaded = [];
            Object.keys(response.data).map(key => {
                const site = response.data[key];
                site.key = key;
                return sitesLoaded.push(site)
            });
            this.props.onFetchSites(sitesLoaded,category);
            this.props.onSetSitesCashed(sitesLoaded);
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

    removeSite = () => {
        const index = this.state.deleteSiteIndex;
        this.setState({loading:true,deleteSiteIndex:null});
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];

        axios.post(SITES_URL+ '_trash.json?auth=' + this.props.token ,site)
        .then(response => {
            axios.delete(SITES_URL+'/' + site.key + '.json?auth=' + this.props.token)
            .then(response => {
                sitesLoaded.splice(index,1);
                this.props.onFetchSites(sitesLoaded);
                this.setState({loading:false});
            })    
        })
    }

    cancelDelete = () =>{
        this.setState({deleteSiteIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteSiteIndex:index});
    }

    filter = (event) => {
        const search = event.target.value;
        const sites = [...this.props.sitesCashed];

        if(search.length===0){
            this.props.onSetSitesFilter(null);
            this.props.onFetchSites(sites);
        }else {
            const criteria = '%' + search + '%';
            const sitesFiltered = sites.filter(site => {
                                    return like(criteria,site.description) || 
                                        like(criteria,site.name)
                                })
            this.props.onSetSitesFilter(search);
            this.props.onFetchSites(sitesFiltered);
        }    
    }

    render(){
        let categories = <Spinner />;
        if ( !this.state.categoryLoading ) {
            categories = <SelectCategory 
                            categories={this.props.categories}
                            changed={(event) => this.showSitesHandler(event)}
                            selected={this.props.lastCategory}
                          />
        }
        
        let sites = <Spinner />;

        if ( !this.state.loading ) {
            sites = <Auxiliary>
                        <SearchText show={this.props.sitesCashed.length>0}
                                    placeholder="filtre os sites encontrados"
                                    changed={this.filter} 
                                    value={this.props.lastFilter} />
                        <Sites show={this.state.showSites} 
                            sites={this.props.lastSitesLoaded}
                            edit={this.editSite}
                            delete={this.confirmDelete}
                            auth={this.props.isAuthenticated}/>
                    </Auxiliary>        
        }    
        return (
            <div className={classes.Home}>
                {categories}
                <br/>
                {sites}
                <Modal show={this.state.deleteSiteIndex!==null}>
                    <h3>Confirma remoção do site ?</h3>
                    <Button btnType="Success" clicked={this.removeSite}>SIM</Button>
                    <Button btnType="Danger" clicked={this.cancelDelete}>NÃO</Button>
                </Modal>    
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        token : state.auth.token,
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
            type: categoryActionTypes.FETCH_CATEGORIES,
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
        onSetSitesCashed: (sitesCashed) => dispatch({
            type: siteActionTypes.SET_SITES_CASH,
            sitesCashed:sitesCashed
        }),
        onSetSitesFilter: (filterCriteria) => dispatch({
            type: siteActionTypes.SET_FILTER,
            filterCriteria:filterCriteria,
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Home,axios));