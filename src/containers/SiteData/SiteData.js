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

import {SITES_URL} from '../../shared/consts';
import {SITES_SUGEST_URL} from '../../shared/consts';

import * as siteActionTypes from '../../store/reducers/site';

import Bundle from '../../components/UI/Bundle/bundle';
import resourceMessage from '../../shared/resourceMessage/resourceMessage';

class SiteData extends Component {
    state = {
        thanks : null,
        siteForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: resourceMessage('NEW_SITE_NAME')
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
                    placeholder: resourceMessage('NEW_SITE_DESC'),
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
                    placeholder: resourceMessage('NEW_SITE')
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
                    placeholder: resourceMessage('NEW_SITE_LOGO')
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
                    placeholder: resourceMessage('NEW_SITE_LOC')
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
                value: '0',
                validation: {
                    required: true,
                },
                valid: true
            }
        },
        formIsValid: false
    }

    componentDidMount = () => {
        if(!this.props.categories || this.props.categories.length === 0) {
            this.props.history.replace('/home');
            return;
        }

        const fillSite = this.props.editSite?this.props.editSite:this.props.approveSite;

        const categoryOptions = this.props.categories.map(category => {
            return {
                value:category.id,
                displayValue:category.name,
            }
        }
        );

        const updatedElementConfig = updateObject(this.state.siteForm.category.elementConfig, {
            options: categoryOptions
        });

        const categoryId = fillSite?fillSite.category:categoryOptions[0].value; 
        const updatedFormElement = updateObject(this.state.siteForm.category, {
            elementConfig: updatedElementConfig,
            value : categoryId,
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
                       if(site.category === this.props.category){
                          this.props.onUpdateSite(site);
                       }else{
                           this.props.onDeleteSite(site.id);         
                       }     

                       this.props.history.goBack();
                    }    
        } )
    }

   

    addSite = (site) => {
        const url = this.props.isAuthenticated
        ?SITES_URL+ '.json?auth=' + this.props.token
        :SITES_SUGEST_URL + '.json';

        axios.post(url ,site)
                .then( response => {
                    if (response) {
                        site.key = response.data.name;
                        if (this.props.isAuthenticated && !this.props.approveSite) {
                            if(site.category === this.props.category)
                                this.props.onAddSite(site);
                        }    
                        if(this.props.approveSite) {
                            this.approvePostSteps();
                        }else{
                            this.setState({loading:false});
                            if(this.props.isAuthenticated) {
                                this.props.history.replace( '/home');
                            }else{
                                this.setState({thanks:true});
                            }
                        }    
                    }    
        } )
    }

    ok = () => {
        this.setState({thanks:null});
        this.props.history.replace( '/home');
    }

    approvePostSteps = () =>{
        axios.delete(SITES_SUGEST_URL+'/' + this.props.approveSite.key + '.json')
        .then(response => {
            this.props.onSuggestionDelete(this.props.approveSite.key);
            this.setState({loading:false});
            this.props.history.replace('/sugest');
        })
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
        }else {    
            this.props.history.goBack();
        }    
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
                                this.props.editSite?resourceMessage('UPDATE'):resourceMessage('ADD')
                                :resourceMessage('SUGGEST_SITE_TITLE');

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
                <Button btnType="Danger" clicked={this.cancelHandler}><Bundle message="CANCEL" /></Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }

        const beginTitle = this.props.isAuthenticated?resourceMessage('NEW_SITE_TITLE'):resourceMessage('SUGGEST_SITE_TITLE');
        return (
            <div className={classes.SiteDataContainer}>
                <div className={classes.SiteData}>
                    <h3>{beginTitle} <Bundle message="NEW_SITE_TITLE2" /></h3>
                    <div>
                        {form}
                    </div>
                    <Modal show={this.state.thanks}>
                        <h3><Bundle message="SUGGEST_SITE_MESSAGE" /></h3>    
                        <Button btnType="Success" clicked={this.ok}><Bundle message="OK" /></Button>
                    </Modal>    
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
        suggestions : state.site.suggestionsLoaded,
        category : state.site.category
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
        onSuggestionDelete: (suggestionKey) => dispatch({
            type: siteActionTypes.DELETE_SUGGESTION,
            key: suggestionKey
        }),
        onFetchSites: (sitesLoaded) => dispatch({
            type: siteActionTypes.FETCH_SITES,
            sites: sitesLoaded
        }),
        onFetchSuggestions: (suggestionsLoaded) => dispatch({
            type: siteActionTypes.FETCH_SUGGESTIONS,
            suggestions: suggestionsLoaded,
        }),
        onUpdateSite: (site) => dispatch({
            type: siteActionTypes.UPDATE_SITE,
            site: site
        }),
        onAddSite: (site) => dispatch({
            type: siteActionTypes.ADD_SITE,
            site: site
        }),
        onDeleteSite: (siteKey) => dispatch({
            type: siteActionTypes.DELETE_SITE,
            key: siteKey
        }),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(SiteData, axios));