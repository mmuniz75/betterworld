import React,{Component} from 'react';

import SelectCategory from '../../components/SelectCategory/SelectCategory';
import Sites from '../../components/Sites/Sites';

import axios from '../../axios';

import './Home.css';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';

const categoriesURL = '/categories.json?orderBy="active"&equalTo=true';
//const categoriesURL = '/categories.json';

class Home extends Component {
        
    state = {
        categories : null,
        sites : null,
        showSites : false,
        sitesFromCategory : null
    }

    componentDidMount= () => {
        if(!this.state.categories) {
            axios.get(categoriesURL)
            .then(response => {
                const categoriesLoaded = [];
                Object.keys(response.data).map(key => {
                    return categoriesLoaded.push(response.data[key])
                }

                );
                this.setState({categories:categoriesLoaded})
            })
        }

        if(!this.state.sites) {
            window.Tabletop.init( { key: publicSpreadsheetUrl,
                            callback: this.getData,
                            simpleSheet: true } )
        }                 
    }

    getData = (data, tabletop) => {
        this.setState({sites:data})
    }

    showSitesHandler = (event) => {
        const category = event.target.value;

        if (category==='0'){
            this.setState({showSites:false});
        }else { 
            
            const sitesByCategory = this.state.sites.filter(site => {
                return site.categoria===category;
            })
            
            this.setState({sitesFromCategory:sitesByCategory ,showSites:true}); 
        }    
    }

    render(){
        return (
            <div className="Home">
                <SelectCategory 
                    categories={this.state.categories}
                    changed={(event) => this.showSitesHandler(event)}
                />
                <Sites show={this.state.showSites} sites={this.state.sitesFromCategory}/>
            </div>    
        )
    }
}

export default Home;