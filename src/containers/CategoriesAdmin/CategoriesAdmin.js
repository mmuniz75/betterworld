import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/reducers/category';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Categories from '../../components/Categories/Categories';

import axios from '../../axios';

import classes from './CategoriesAdmin.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {CATEGORIES_URL} from '../../shared/consts';

const categoriesURL = CATEGORIES_URL ;

class CategoriesAdmin extends Component {
        
    state = {
        loading : false,
        deleteCategoryIndex : null,
        categories: []
    }

    componentDidMount= () => {
        this.loadCategories();
    }

    loadCategories(){
        if(this.state.categories.length===0) {
            this.setState({loading:true}); 
            axios.get(categoriesURL + ".json")
            .then(response => {
                const categoriesLoaded = [];
                Object.keys(response.data).map(key => {
                    const category = response.data[key];
                    if(category){
                        category.key = key;
                        return categoriesLoaded.push(category)
                    }    
                }

                );
         
                this.setState({loading:false,categories: categoriesLoaded}); 
            })
        }    
    }
   

    editCategory = (index) => {
        const categoriesLoaded = [...this.state.categories];
        const category = categoriesLoaded[index];
        category.index = index;
        this.props.onCategoryEdit(category);
        this.props.history.push('/categoryData');
    }

    removeCategory = () => {
        const index = this.state.deleteCategoryIndex;
        this.setState({loading:true,deleteCategoryIndex:null});
        const categoriesLoaded = [...this.state.categories];
        const category = categoriesLoaded[index];

        axios.delete(categoriesURL+'/' + category.key + '.json?auth=' + this.props.token)
        .then(response => {
            this.state.categories.splice(index,1);
            this.props.onFetchCategories([]);
            this.setState({loading:false});
        })    
       
    }

    cancelDelete = () =>{
        this.setState({deleteCategoryIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteCategoryIndex:index});
    }

    render(){
        let categories = <Spinner />;
        if ( !this.state.loading ) {
             categories =   <Categories show={this.state.categories} 
                                categories={this.state.categories}
                                edit={this.editCategory}
                                delete={this.confirmDelete}
                                auth={this.props.isAuthenticated}/>
             
        }    
        return (
            <div className={classes.Categories}>
                {categories}
                <Modal show={this.state.deleteCategoryIndex!==null}>
                    <h3>Confirma remoção da Categoria ?</h3>
                    <Button btnType="Success" clicked={this.removeCategory}>SIM</Button>
                    <Button btnType="Danger" clicked={this.cancelDelete}>NÃO</Button>
                </Modal>    
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token,
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategories: (categories) => dispatch({
            type: actionTypes.FETCH_CATEGORIES,
            categories: categories
        }),
        onCategoryEdit: (categoryToEdit) => dispatch({
            type: actionTypes.EDIT,
            categoryToEdit:categoryToEdit
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(CategoriesAdmin,axios));