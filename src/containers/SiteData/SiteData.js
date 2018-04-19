import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './SiteData.css';
import axios from '../../axios'
import Input from '../../components/UI/Input/Input';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { updateObject, checkValidity } from '../../shared/utility';

import {SITES_URL} from '../../shared/consts';
import {SITES_SUGEST_URL} from '../../shared/consts';

import siteActionTypes from '../../store/reducers/site';

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
            logo: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Logo URL'
                },
                value: '',
                validation: {
                },
                valid: true,
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

        const categoryName = this.props.editSite?this.props.editSite.category:'Saude'; 
        const updatedFormElement = updateObject(this.state.siteForm.category, {
            elementConfig: updatedElementConfig,
            value : categoryName
        });

        const updatedSiteForm = updateObject(this.state.siteForm, {
            category: updatedFormElement
        });
        this.setState({ siteForm : updatedSiteForm});
       
    }

    componentWillMount = () => {
        if(this.props.editSite){
            const editSite = {...this.props.editSite};
            const name = updateObject(this.state.siteForm.name, {
                value : editSite.name
            });
            const description = updateObject(this.state.siteForm.description, {
                value : editSite.description
            });
            const logo = updateObject(this.state.siteForm.logo, {
                value : editSite.logo
            });
            const site = updateObject(this.state.siteForm.site, {
                value : editSite.site
            });

            const updatedSiteForm = updateObject(this.state.siteForm, {
                name: name,
                description: description,
                logo : logo,
                site : site
            });

            this.setState({ siteForm : updatedSiteForm});
        }
    }

    submitHandler = ( event ) => {
        this.setState({loading:true});
        event.preventDefault();

        const formData = {
            userId : this.props.userId,
            logo : '',
            id : (Date.now() + Math.random()).toFixed(0),
            active : true
        };

        for (let formElementIdentifier in this.state.siteForm) {
            formData[formElementIdentifier] = this.state.siteForm[formElementIdentifier].value;
        }
        
        const url = this.props.isAuthenticated
                     ?SITES_URL+ '?auth=' + this.props.token
                     :SITES_SUGEST_URL + '.json';

        axios.post(url ,formData)
        .then( response => {
            this.setState({loading:false});
            if (response) {
                this.props.history.replace( '/' );
            }    
        } )
                
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

        const saveButtonLabel = this.props.isAuthenticated?'Adicionar':'Sugerir';

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

        const beginTitle = this.props.isAuthenticated?'Cadastre':'Sugira';
        return (
            
                <div className={classes.SiteData}>
                    <h3>{beginTitle} um Site que pode ajudar a tornar o mundo melhor</h3>
                    <div>
                    {form}
                    </div>
                </div>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        userId : state.auth.userId,
        token : state.auth.token,
        isAuthenticated: state.auth.token !== null,
        editSite : state.site.siteToEdit
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onSiteEdit: (siteToEdit) => dispatch({
            type: siteActionTypes.SITE_EDIT,
            site:siteToEdit
        })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(SiteData, axios));