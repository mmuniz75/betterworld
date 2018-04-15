import React,{Component} from 'react';
import { connect } from 'react-redux';
import SelectCategory from '../../components/SelectCategory/SelectCategory';
import Sites from '../../components/Sites/Sites';
import * as actionTypes from '../../store/reducers/category';
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios';

import classes from './Home.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';

const categoriesURL = '/categories.json?orderBy="active"&equalTo=true';
const sitesURL = '/sites.json?orderBy="category"&equalTo=';

class Home extends Component {
        
    state = {
        sites : null,
        showSites : false,
        sitesFromCategory : null,
        loading : false
    }

    componentDidMount= () => {
        this.loadCategories();
        //this.loadSitesFromSpreedSheet();
    }

    loadSitesFromSpreedSheet(){
        if(!this.state.sites) {
            window.Tabletop.init( { key: publicSpreadsheetUrl,
                            callback: this.getData,
                            simpleSheet: true } )
        }  
    }

    loadCategories(){
        if(this.props.categories.length===0) {
            this.props.onFetchCategoriesStart();
            axios.get(categoriesURL)
            .then(response => {
                const categoriesLoaded = [];
                Object.keys(response.data).map(key => {
                    return categoriesLoaded.push(response.data[key])
                }

                );
                this.props.onFetchCategories(categoriesLoaded);
            })
            .catch( error => {
                this.props.onFetchCategoriesFail(error);
            } );
        }
    }

    getData = (data, tabletop) => {
        this.setState({sites:data})
    }

    showSitesHandler = (event) => {
        const category = event.target.value;

        if (category==='0'){
            this.setState({showSites:false});
        }else { 
            this.setState({loading:true});
            axios.get(sitesURL + '"' + category + '"')
            .then(response => {
                const sitesLoaded = [];
                Object.keys(response.data).map(key => {
                    return sitesLoaded.push(response.data[key])
                });
                this.setState({sitesFromCategory:sitesLoaded ,showSites:true,loading:false}); 
            })
            .catch( error => {
                console.log(error);
            })
        }    
    }

    editSite = (id) => {
        console.log(id);
        this.props.history.push('/siteData');
    }

    render(){
        let categories = <Spinner />;
        if ( !this.props.categoryLoading ) {
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
        categoryLoading: state.category.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategoriesStart: () => dispatch({
            type: actionTypes.FETCH_CATEGORIES_START,
        }),
        onFetchCategories: (categories) => dispatch({
            type: actionTypes.FETCH_CATEGORIES_SUCCESS,
            categories: categories
        }),
        onFetchCategoriesFail: (error) => dispatch({
            type: actionTypes.FETCH_CATEGORIES_FAIL,
            error: error
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Home,axios));