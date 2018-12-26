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
        salved: false
    }

    componentWillUnmount = () => {
        const categoriesLoaded = [...this.props.categories];
        const category = categoriesLoaded[0];
        
        if(category && !category.key && category.name) {
            this.addCategory(category);
        }
    }

    componentDidMount= () => {
        this.loadCategories();
    }

    loadCategories(){
        if(this.props.categories.length===0) {
            this.setState({loading:true}); 
            axios.get(categoriesURL + ".json")
            .then(response => {
                const categoriesLoaded = [];
                Object.keys(response.data).map(key => {
                    const category = response.data[key];
                    if(category){
                        category.key = key;
                        categoriesLoaded.push(category)
                    }    
                    return categoriesLoaded;
                }

                );
                this.props.onFetchCategories(categoriesLoaded);
                this.setState({loading:false,categories: categoriesLoaded}); 
            })
        }    
    }
   

    changeCategory = (index,value) => {
        const categoriesLoaded = [...this.props.categories];
        const category = categoriesLoaded[index];
        category.name=value;
        this.setState({categories:categoriesLoaded});
    }

    saveCategory = (index,value) => {
        const categoriesLoaded = [...this.props.categories];
        const category = categoriesLoaded[index];
        
        if(category.key) {
            category.index = index;
            this.updateCategory(category);
        }else {
            this.addCategory(category);
        }
    }

    removeCategory = () => {
        const index = this.state.deleteCategoryIndex;
        this.setState({deleteCategoryIndex:null});
        const categoriesLoaded = [...this.props.categories];
        const category = categoriesLoaded[index];
        this.props.onCategoryDelete(index);
        axios.delete(categoriesURL+'/' + category.key + '.json?auth=' + this.props.token)
    }

    cancelDelete = () =>{
        this.setState({deleteCategoryIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteCategoryIndex:index});
    }

    enableCategory = (index) => {
        const categoriesLoaded = [...this.props.categories];
        const category = categoriesLoaded[index];
        category.index = index;
        category.active = !category.active;
        this.props.onCategoryUpdate(category);
        if(category.key) {
            this.updateCategory(category);
        }    
    }

    updateCategory = (category) => {
        const url = categoriesURL+ '/' + category.key + '.json?auth=' + this.props.token ;
        axios.put(url ,category)
                .then( response => {
                    if (response) {
                        this.showSalveMessage();
                        this.props.onCategoryUpdate(category);
                    }    
        } )
    }

    addCategory = (category) => {
        const url = categoriesURL + '.json?auth=' + this.props.token;

        axios.post(url ,category)
                .then( response => {
                    if (response) {
                        category.key = response.data.name;
                        this.props.onCategoryUpdate(category);
                    }    
                        
        } )
    }

    startCategory = () => {
        const category = {userId : this.props.userId,
                          id : (Date.now() + Math.random()).toFixed(0),
                          name:"", 
                          active: false};
        this.props.onAddCategory(category);
    }

    showSalveMessage(){
        this.setState({salved: true});
        setTimeout(()=>this.setState({salved: false}), 1000);
      }

    render(){
        let categories = <Spinner />;
        if ( !this.state.loading ) {
             categories =   <Categories show={this.props.categories} 
                                categories={this.props.categories}
                                save={this.saveCategory}
                                change={this.changeCategory}
                                delete={this.confirmDelete}
                                enable={this.enableCategory}
                                auth={this.props.isAuthenticated}/>
             
        }
        const addButton = this.props.categories && this.props.categories[0] && this.props.categories[0].key
                                ?<a onClick={() => this.startCategory()} style={{cursor: 'pointer'}} >
                                    <i className="fas fa-plus fa-lg" title='Adicionar Categoria' />
                                </a>
                                :null;
        
        return (
                <div className={classes.Categories}>
                    {addButton}
                    <br/><br/>
                    {categories}
                    <Modal show={this.state.deleteCategoryIndex!==null}>
                        <h3>Confirma remoção da Categoria ?</h3>
                        <Button btnType="Success" clicked={this.removeCategory}>SIM</Button>
                        <Button btnType="Danger" clicked={this.cancelDelete}>NÃO</Button>
                    </Modal> 
                    <Modal show={this.state.salved}>
                        <h3>Categoria Alterada</h3>
                    </Modal>     
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId : state.auth.userId,
        token : state.auth.token,
        isAuthenticated: state.auth.token !== null,
        categories: state.category.categoriesAdmin,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategories: (categories) => dispatch({
            type: actionTypes.FETCH_ADMIN,
            categories: categories
        }),
        onCategoryEdit: (categoryToEdit) => dispatch({
            type: actionTypes.EDIT,
            categoryToEdit:categoryToEdit
        }),
        onCategoryDelete: (indexCategory) => dispatch({
            type: actionTypes.DELETE,
            index:indexCategory
        }),
        onCategoryUpdate: (categoryToUpdate) => dispatch({
            type: actionTypes.UPDATE,
            categoryData: categoryToUpdate
        }),
        onAddCategory: (category) => dispatch({
            type: actionTypes.ADD,
            categoryData: category
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(CategoriesAdmin,axios));