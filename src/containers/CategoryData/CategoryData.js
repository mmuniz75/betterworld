import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';

import classes from './CategoryData.css';
import axios from '../../axios'
import Input from '../../components/UI/Input/Input';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { updateObject, checkValidity } from '../../shared/utility';

import {CATEGORIES_URL} from '../../shared/consts';

import * as actionTypes from '../../store/reducers/category';

class CategoryData extends Component {
    state = {
        categoryForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Nome'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            active: {
                elementType: 'input',
                elementConfig: {
                    type: 'checkbox',
                    placeholder: 'Ativo'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false,
        loading : false
    }

    
    componentWillMount = () => {
        const fillCategory = this.props.editCategory?this.props.editCategory:null;

        if(fillCategory){
            const editCategory = {...fillCategory};
            const name = updateObject(this.state.categoryForm.name, {
                value : editCategory.name,
                valid: true
            });
            const active = updateObject(this.state.categoryForm.active, {
                value : editCategory.active,
                valid: true
            });
            const updatedCategoryForm = updateObject(this.state.CategoryForm, {
                name: name,
                active: active,
            });

            this.setState({ categoryForm : updatedCategoryForm,formIsValid:true});
        }
    }

    submitHandler = ( event ) => {
        this.setState({loading:true});
        event.preventDefault();

        const formData = {
            userId : this.props.userId,
            id : (Date.now() + Math.random()).toFixed(0),
            active : true
        };

        for (let formElementIdentifier in this.state.categoryForm) {
            formData[formElementIdentifier] = this.state.categoryForm[formElementIdentifier].value;
        }
        
        if(!this.props.editCategory){
            this.addCategory(formData);
        }else{
            this.updateCategory(formData);
        }    
                
    }

    updateCategory = (category) => {
        const url = CATEGORIES_URL+ '/' +this.props.editCategory.key + '.json?auth=' + this.props.token ;
        
        axios.put(url ,Category)
                .then( response => {
                    this.setState({loading:false});
                    if (response) {
                       this.props.onUpdateCategory(category);
                       this.props.history.replace( '/categories' );
                    }    
        } )
    }

   

    addCategory = (category) => {
        const url = CATEGORIES_URL + '.json?auth=' + this.props.token;

        axios.post(url ,category)
                .then( response => {
                    if (response) {
                        category.key = response.data.name;
                        this.props.onAddCategory(category);
                        this.setState({loading:false});
                        this.props.history.replace( '/categories');
                    }    
                        
        } )
    }


    cancelHandler = (event) => {
        event.preventDefault();
        this.props.onCategoryEdit(null);
        this.props.history.replace('/categories');
    }

    inputChangedHandler = (event, inputIdentifier) => {
        
        const updatedFormElement = updateObject(this.state.categoryForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.categoryForm[inputIdentifier].validation),
            touched: true
        });
        const updatedCategoryForm = updateObject(this.state.categoryForm, {
            [inputIdentifier]: updatedFormElement
        });
        
        let formIsValid = true;
        for (let inputIdentifier in updatedCategoryForm) {
            formIsValid = updatedCategoryForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({categoryForm: updatedCategoryForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.categoryForm) {
            formElementsArray.push({
                id: key,
                config: this.state.categoryForm[key]
            });
        }

        const saveButtonLabel = this.props.editCategory?'Alterar':'Adicionar';

        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>{saveButtonLabel}</Button>
                &nbsp;
                <Button btnType="Danger" clicked={this.cancelHandler}>Cancelar</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }

        return (
            <div className={classes.CategoryData}>
                <h3>Cadastro de Categoria</h3>
                <div>
                    {form}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId : state.auth.userId,
        token : state.auth.token,
        isAuthenticated: state.auth.token !== null,
        editCategory : state.category.categoryToEdit,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onCategoryEdit: (categoryToEdit) => dispatch({
            type: ationTypes.EDIT,
            category: categoryToEdit
        }),
        onUpdateCategory: (category) => dispatch({
            type: ationTypes.UPDATE,
            categoryData: category
        }),
        onAddCategory: (category) => dispatch({
            type: ationTypes.ADD,
            categoryData: category
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(CategoryData, axios));