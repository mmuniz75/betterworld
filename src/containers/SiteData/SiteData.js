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
                    placeholder: 'Site Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            description: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Description'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            url: {
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
            categoryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'Economia', displayValue: 'Economia'},
                        {value: 'Ecologia', displayValue: 'Ecologia'}
                    ]
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: true
            }
        },
        formIsValid: false
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

    cancelHandler = () => {
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>Save</Button>
                &nbsp;
                <Button btnType="Danger" clicked={this.cancelHandler}>Cancel</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }
        return (
            <Modal show>
                <div className={classes.SiteData}>
                    <h4>Enter your Site Data</h4>
                    {form}
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