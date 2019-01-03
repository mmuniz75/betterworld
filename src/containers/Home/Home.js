import React,{Component} from 'react';
import { connect } from 'react-redux';
import SelectCategory from '../../components/SelectCategory/SelectCategory';
import * as categoryActionTypes from '../../store/reducers/category';
import * as siteActionTypes from '../../store/reducers/site';

import Spinner from '../../components/UI/Spinner/Spinner';
import Bundle from '../../components/UI/Bundle/bundle';
import axios from '../../axios';


import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {CATEGORIES_URL} from '../../shared/consts';

const categoriesURL = CATEGORIES_URL + '.json?orderBy="active"&equalTo=true';


class Home extends Component {
        
    state = {
        categoryLoading: false,
    }

    componentDidMount= () => {
        this.loadCategories();
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

    showSitesHandler = (event) => {
        const category = event.target.value;
        if (category==='0'){
            this.setState({showSites:false});
            this.props.onSetCategory(0);
        }else { 
           this.props.onSetCategory(category); 
           this.props.history.replace('/sites');
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
            <section id="content-wrap" className="site-page">
            <div className="row">
                <div className="col-twelve">
                   <section>  
                        <div className="content-media">						
		                    <img src="/assets/images/hands-around-world-backgrounds-wallpapers.jpg" alt="" style={{width:1000, height:400}} />						  
                        </div>

                        <div className="primary-content">

                            <h1 className="entry-title add-bottom"><Bundle message="TITLE" /></h1>	

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