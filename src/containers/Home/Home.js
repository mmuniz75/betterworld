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
import resourceMessage from '../../shared/resourceMessage/resourceMessage';
import Bundle from '../../components/UI/Bundle/bundle';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

import axios from '../../axios';

import classes from './Home.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_URL,CATEGORIES_URL} from '../../shared/consts';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';
const categoriesURL = CATEGORIES_URL + '.json?orderBy="active"&equalTo=true';
const sitesURL = SITES_URL + '.json?orderBy="category"&equalTo=';

class Home extends Component {
        
    state = {
        sites : null,
        loading : false,
        categoryLoading: false,
    }

    componentDidMount= () => {
        this.loadCategories();
        this.setState({showSites :this.props.lastCategory!==0});
    }
       
    loadCategories(){
        if(this.props.categories.length===0) {
            this.setState({categoryLoading:true}); 
            axios.get(categoriesURL)
            .then(response => {
                const categoriesLoaded = [];

                Object.keys(response.data).map(key => {
                    const category = response.data[key];
                    if(category){
                        category.key = key;
                        categoriesLoaded.push(category)
                    }
                    return null;    
                }

                );
                this.props.onFetchCategories(categoriesLoaded);
                this.setState({categoryLoading:false}); 
            })
            .catch( error => {
                this.setState({categoryLoading:false}); 
                console.log(error);
            })
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

        return (
            <section id="content-wrap" class="site-page">
            <div class="row">
                <div class="col-twelve">
                   <section>  
                        <div class="content-media">						
		                    <img src="/assets/images/hands-around-world-backgrounds-wallpapers.jpg" style={{width:1000, height:500}} />						  
                        </div>

                        <div class="primary-content">

                            <h1 class="entry-title add-bottom"><Bundle message="TITLE" /></h1>	

                            <p><Bundle message="PARAGRAPH1" /></p> 

                            <p><Bundle message="PARAGRAPH2" /></p>

                            <p><Bundle message="PARAGRAPH3" /></p>
                      
                            {categories}
                        </div>						
                    </section>  		
                </div>
            </div>
         </section>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        token : state.auth.token,
        userId : state.auth.userId,
        lastCategory : state.site.category,
        isAuthenticated: state.auth.token !== null,
        lastFilter : state.site.filterCriteria,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategories: (categories) => dispatch({
            type: categoryActionTypes.FETCH,
            categories: categories
        }),
        onSetCategory: (category) => dispatch({
            type: siteActionTypes.SET_CATEGORY,
            category:category
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Home,axios));

/*
         <SearchText show={this.props.sitesCashed.length>0}
                                    placeholder={resourceMessage("SITE_FILTER")}
                                    changed={this.filter} 
                                    value={this.props.lastFilter} />

            <Modal show={this.state.deleteSiteIndex!==null}>
                    <h3><Bundle message="SITES_DELETE_MESSAGE" /></h3>
                    <Button btnType="Success" clicked={this.removeSite}><Bundle message="YES" /></Button>
                    <Button btnType="Danger" clicked={this.cancelDelete}><Bundle message="NO" /></Button>
                </Modal>    

*/