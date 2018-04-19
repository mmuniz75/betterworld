import React,{Component} from 'react';
import { connect } from 'react-redux';
import SelectCategory from '../../components/SelectCategory/SelectCategory';
import Sites from '../../components/Sites/Sites';
import * as categoryActionTypes from '../../store/reducers/category';
import * as siteActionTypes from '../../store/reducers/site';

import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios';

import classes from './Home.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_URL} from '../../shared/consts';


const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';
const categoriesURL = '/categories.json?orderBy="active"&equalTo=true';
const sitesURL = SITES_URL + '?orderBy="category"&equalTo=';

class Home extends Component {
        
    state = {
        sites : null,
        showSites : false,
        sitesFromCategory : null,
        loading : false,
        categoryLoading: false,
    }

    componentDidMount= () => {
        this.loadCategories();
        //this.loadSitesFromSpreedSheet();
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
        const category = event.target.value;

        if (category==='0'){
            this.setState({showSites:false});
        }else { 
           if(category===this.props.lastCategory){
                this.setState({sitesFromCategory:this.props.lastSitesLoaded ,showSites:true}); 
           }else{
               this.loadSites(category);
           }
        }    
    }

    loadSites = (category) => {
        this.setState({loading:true});
        axios.get(sitesURL + '"' + category + '"')
        .then(response => {
            const sitesLoaded = [];
            Object.keys(response.data).map(key => {
                return sitesLoaded.push(response.data[key])
            });
            this.props.onFetchSites(sitesLoaded,category);
            this.setState({sitesFromCategory:sitesLoaded ,showSites:true,loading:false}); 
        })
    }

    editSite = (id) => {
        console.log(id);
        this.props.history.push('/siteData');
    }

    render(){
        let categories = <Spinner />;
        if ( !this.state.categoryLoading ) {
            categories = <SelectCategory 
                            categories={this.props.categories}
                            changed={(event) => this.showSitesHandler(event)}
                          />
        }
        
        let sites = <Spinner />;
        if ( !this.state.loading ) {
            sites = <Sites show={this.state.showSites} 
                            sites={this.state.sitesFromCategory}
                            edit={this.editSite}/>
        }    
        return (
            <div className={classes.Home}>
                {categories}
                <br/>
                {sites}
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        token : state.auth.token,
        lastSitesLoaded : state.site.lastSitesLoaded,
        lastCategory : state.site.category
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
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Home,axios));