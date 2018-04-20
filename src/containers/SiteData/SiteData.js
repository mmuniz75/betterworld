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

import * as siteActionTypes from '../../store/reducers/site';

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
                    rows:4 
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
            location: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Localidade'
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
        const fillSite = this.props.editSite?this.props.editSite:this.props.approveSite;

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

        const categoryName = fillSite?fillSite.category:'Saude'; 
        const updatedFormElement = updateObject(this.state.siteForm.category, {
            elementConfig: updatedElementConfig,
            value : categoryName,
        });

        const updatedSiteForm = updateObject(this.state.siteForm, {
            category: updatedFormElement
        });
        this.setState({ siteForm : updatedSiteForm});
       
    }

    componentWillMount = () => {
        const fillSite = this.props.editSite?this.props.editSite:this.props.approveSite;

        if(fillSite){
            const editSite = {...fillSite};
            const name = updateObject(this.state.siteForm.name, {
                value : editSite.name,
                valid: true
            });
            const description = updateObject(this.state.siteForm.description, {
                value : editSite.description,
                valid: true
            });
            const logo = updateObject(this.state.siteForm.logo, {
                value : editSite.logo
            });
            const site = updateObject(this.state.siteForm.site, {
                value : editSite.site,
                valid: true
            });
            const location = updateObject(this.state.siteForm.location, {
                value : editSite.location,
                valid: true
            });
            const updatedSiteForm = updateObject(this.state.siteForm, {
                name: name,
                description: description,
                logo : logo,
                site : site,
                location : location
            });

            this.setState({ siteForm : updatedSiteForm,formIsValid:true});
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

        for (let formElementIdentifier in this.state.siteForm) {
            formData[formElementIdentifier] = this.state.siteForm[formElementIdentifier].value;
        }
        
        if(!this.props.editSite){
            this.addSite(formData);
        }else{
            this.updateSite(formData);
        }    
                
    }

    updateSite = (site) => {
        const url = SITES_URL+ '/' +this.props.editSite.key + '.json?auth=' + this.props.token ;
        
        axios.put(url ,site)
                .then( response => {
                    this.setState({loading:false});
                    if (response) {
                       site.key = this.props.editSite.key;
                       this.updateCash(site);
                       this.props.onSiteEdit(null);
                       this.props.history.replace( '/' );
                    }    
        } )
    }

    updateCash = (site) => {
        const sites = [...this.props.lastSitesLoaded];
        const index = this.props.editSite.index;
        sites.splice(index,1,site);
        this.props.onFetchSites(sites);
    }

    addSite = (site) => {
        const url = this.props.isAuthenticated
        ?SITES_URL+ '.json?auth=' + this.props.token
        :SITES_SUGEST_URL + '.json';

        axios.post(url ,site)
                .then( response => {
                    if (response) {
                        site.key = response.data.name;
                        if (this.props.isAuthenticated) {
                            this.addSiteCash(site);
                        }    
                        if(this.props.approveSite) {
                            this.approvePostSteps();
                        }else{
                            
                            this.setState({loading:false});
                            this.props.history.replace( '/');
                        }    
                    }    
        } )
    }

    approvePostSteps = () =>{
        axios.delete(SITES_SUGEST_URL+'/' + this.props.approveSite.key + '.json')
        .then(response => {
            const suggestionLoaded = [...this.props.suggestions];
            const index = this.props.approveSite.index;
            suggestionLoaded.splice(index,1);
            this.props.onFetchSuggestions(suggestionLoaded);

            this.props.onSiteApprove(null);
            this.setState({loading:false});
            this.props.history.replace('/sugest');
        })
    }

    addSiteCash = (site) => {
        const sites = [...this.props.lastSitesLoaded];
        sites.push(site);
        this.props.onFetchSites(sites);
    }



    cancelHandler = (event) => {
        event.preventDefault();
        
        if(this.props.editSite) {
            this.props.onSiteEdit(null);
            this.props.history.replace('/sites');
        }    

        if(this.props.approveSite) {
            this.props.onSiteApprove(null);
            this.props.history.replace('/sugest');
        }    
       
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

        const saveButtonLabel = this.props.isAuthenticated?
                                this.props.editSite?'Alterar':'Adicionar'
                                :'Sugerir';

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
        editSite : state.site.siteToEdit,
        approveSite : state.site.siteToApprove,
        lastSitesLoaded : state.site.lastSitesLoaded,
        suggestions : state.site.suggestionsLoaded
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onSiteEdit: (siteToEdit) => dispatch({
            type: siteActionTypes.SITE_EDIT,
            site: siteToEdit
        }),
        onSiteApprove: (siteToApprove) => dispatch({
            type: siteActionTypes.SITE_APPROVE,
            site: siteToApprove
        }),
        onFetchSites: (sitesLoaded) => dispatch({
            type: siteActionTypes.FETCH_SITES,
            sites: sitesLoaded
        }),
        onFetchSuggestions: (suggestionsLoaded) => dispatch({
            type: siteActionTypes.FETCH_SUGGESTIONS,
            suggestions: suggestionsLoaded,
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(SiteData, axios));