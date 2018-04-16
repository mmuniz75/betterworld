import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';

import classes from './SiteData.css';
import axios from '../../axios'
import Input from '../../components/UI/Input/Input';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { updateObject, checkValidity } from '../../shared/utility';

class SiteData extends Component {
    state = {
        siteForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Nome do Site'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            description: {
                elementType: 'textarea',
                elementConfig: {
                    type: 'text-area',
                    placeholder: 'Descrição',
                    rows:6 
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            site: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Site'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            category: {
                elementType: 'select',
                elementConfig: {
                    options: []
                },
                value: 'Saude',
                validation: {
                    required: true,
                },
                valid: true
            }
        },
        formIsValid: false
    }

    componentDidMount = () => {

        const categoryOptions = this.props.categories.map(category => {
            return {
                value:category.name,
                displayValue:category.name,
            }
        }
        );

        const updatedElementConfig = updateObject(this.state.siteForm.category.elementConfig, {
            options: categoryOptions
        });

        const updatedFormElement = updateObject(this.state.siteForm.category, {
            elementConfig: updatedElementConfig
        });

        const updatedSiteForm = updateObject(this.state.siteForm, {
            category: updatedFormElement
        });

        this.setState({ siteForm : updatedSiteForm});
       
    }

    submitHandler = ( event ) => {
        event.preventDefault();
  
        const formData = {};
        for (let formElementIdentifier in this.state.siteForm) {
            formData[formElementIdentifier] = this.state.siteForm[formElementIdentifier].value;
        }
        
        axios.post('/sites.json',formData)
        .then( response => {
            this.props.history.replace( '/' );
        } )
        .catch( error => {
            console.log(error);
        } );
        
    }

    cancelHandler = (event) => {
        event.preventDefault();
        this.props.history.goBack();
    }

    inputChangedHandler = (event, inputIdentifier) => {
        
        const updatedFormElement = updateObject(this.state.siteForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.siteForm[inputIdentifier].validation),
            touched: true
        });
        const updatedsiteForm = updateObject(this.state.siteForm, {
            [inputIdentifier]: updatedFormElement
        });
        
        let formIsValid = true;
        for (let inputIdentifier in updatedsiteForm) {
            formIsValid = updatedsiteForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({siteForm: updatedsiteForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.siteForm) {
            formElementsArray.push({
                id: key,
                config: this.state.siteForm[key]
            });
        }
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>Adicionar</Button>
                &nbsp;
                <Button btnType="Danger" clicked={this.cancelHandler}>Cancelar</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }
        return (
            <Modal show>
                <div className={classes.SiteData}>
                    <h4>Cadastre um Site que pode ajudar a tornar o mundo melhor</h4>
                    <div>
                    {form}
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
    }
};

export default connect(mapStateToProps)(withErrorHandler(SiteData, axios));