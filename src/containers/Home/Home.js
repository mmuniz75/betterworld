import React,{Component} from 'react';
import { connect } from 'react-redux';
import SelectCategory from '../../components/SelectCategory/SelectCategory';
import SearchText from '../../components/SearchText/SearchText'
import Sites from '../../components/Sites/Sites';
import * as categoryActionTypes from '../../store/reducers/category';
import * as siteActionTypes from '../../store/reducers/site';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import resourceMessage from '../../shared/resourceMessage/resourceMessage';
import Bundle from '../../components/UI/Bundle/bundle';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

import axios from '../../axios';

import classes from './Home.css';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {SITES_URL,CATEGORIES_URL} from '../../shared/consts';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hyjnMbHwXHJh4-HgAMAj92ephw30iQm9YhLduNtzjJQ/pubhtml';
const categoriesURL = CATEGORIES_URL + '.json?orderBy="active"&equalTo=true';
const sitesURL = SITES_URL + '.json?orderBy="category"&equalTo=';

class Home extends Component {
        
    state = {
        sites : null,
        loading : false,
        categoryLoading: false,
        showSites : false,
        deleteSiteIndex : null
    }

    componentDidMount= () => {
        this.loadCategories();
        this.setState({showSites :this.props.lastSitesLoaded && this.props.lastCategory!==0});
    }
       

    loadSitesFromSpreedSheet(){
        if(!this.state.sites) {
            window.Tabletop.init( { key: publicSpreadsheetUrl,
                            callback: this.importData,
                            simpleSheet: true } )
        }  
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

    importData = (data, tabletop) => {
        //this.setState({sites:data})
        //axios.post('/sites.json?auth=' + this.props.token,data);
    }

    showSitesHandler = (event) => {
        const category = event.target.value;
        if (category==='0'){
            this.setState({showSites:false});
            this.props.onSetCategory(0);
        }else { 
           if(category!==this.props.lastCategory){
               this.loadSites(category);
           }
           this.setState({showSites:true}); 
        }    
    }

    loadSites = (category) => {
        this.setState({loading:true});
        axios.get(sitesURL + '"' + category + '"')
        .then(response => {
            const sitesLoaded = [];
            Object.keys(response.data).map(key => {
                const site = response.data[key];
                if(this.props.isAuthenticated || site.active) {
                    site.key = key;
                    sitesLoaded.push(site)
                }
                return null;    
            });
            this.props.onFetchSites(sitesLoaded,category);
            this.setState({loading:false}); 
        })
    }

    editSite = (index) => {
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        site.index = index;
        this.props.onSiteEdit(site);
        this.props.history.push('/siteData');
    }

    enableSite = (index) => {
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        site.index = index;
        site.active = !site.active;
        this.updateSite(site);
    }

    removeSite = () => {
        const index = this.state.deleteSiteIndex;
        this.setState({deleteSiteIndex:null});
        const sitesLoaded = [...this.props.lastSitesLoaded];
        const site = sitesLoaded[index];
        this.props.onDeleteSite(site.key);

        axios.post(SITES_URL+ '_trash.json?auth=' + this.props.token ,site)
        .then(response => {
            axios.delete(SITES_URL+'/' + site.key + '.json?auth=' + this.props.token)
        })
    }

    cancelDelete = () =>{
        this.setState({deleteSiteIndex:null});
    }    

    confirmDelete = (index) => {
        this.setState({deleteSiteIndex:index});
    }

    filter = (event) => {
        this.props.onFilterSites(event.target.value);
    }

    updateSite = (site) => {
        const url = SITES_URL+ '/' + site.key + '.json?auth=' + this.props.token ;
        
        axios.put(url ,site)
                .then( response => {
                    this.setState({loading:false});
                    if (response) {
                       this.props.onUpdateSite(site);
                    }    
        } )
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
        
        let sites = <Spinner />;

        if ( !this.state.loading ) {
            sites = <Auxiliary>
                        <SearchText show={this.props.sitesCashed.length>0}
                                    placeholder={resourceMessage("SITE_FILTER")}
                                    changed={this.filter} 
                                    value={this.props.lastFilter} />
                        <Sites show={this.state.showSites} 
                            sites={this.props.lastSitesLoaded}
                            edit={this.editSite}
                            delete={this.confirmDelete}
                            canDelete={this.props.canDelete}
                            canEdit={this.props.canEdit}
                            auth={this.props.isAuthenticated}
                            enable={this.enableSite}
                            userId={this.props.userId}
                            />
                            
                    </Auxiliary>        
        }    
        return (
            <div >
                <section id="page-header">
                    <div class="row current-cat">
                        <div class="col-full">
                            <h1>Area: Economy</h1>
                        </div>   		
                    </div>
                </section>

                <section id="bricks" class="with-top-sep">

                    <div class="row masonry">
                        <div class="bricks-wrapper">

                            <div class="grid-sizer"></div>

                            <article class="brick entry format-standard animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/diagonal-building.jpg" alt="building" />             
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Design</a> 
                                            <a href="#">Photography</a>               				
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">Just a Standard Format Post.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>

                                </article>

                            <article class="brick entry format-standard animate-this">

                                <div class="entry-thumb">
                                    <a href="single-standard.html" class="thumb-link">
                                        <img src="images/thumbs/ferris-wheel.jpg" alt="ferris wheel" />                   
                                    </a>
                                </div>

                                <div class="entry-text">
                                    <div class="entry-header">

                                        <div class="entry-meta">
                                            <span class="cat-links">
                                                <a href="#">Design</a> 
                                                <a href="#">UI</a>                			
                                            </span>			
                                        </div>

                                        <h1 class="entry-title"><a href="single-standard.html">This Is Another Standard Format Post.</a></h1>
                                        
                                    </div>
                                            <div class="entry-excerpt">
                                                Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                            </div>
                                </div>
                            
                            </article>

                            <article class="brick entry format-audio animate-this">

                                <div class="entry-thumb">
                                    <a href="single-audio.html" class="thumb-link">
                                        <img src="images/thumbs/concert.jpg" alt="concert" />                      
                                    </a>

                                    <div class="audio-wrap">
                                        <audio id="player2" src="media/AirReview-Landmarks-02-ChasingCorporate.mp3" width="100%" height="42" controls="controls"></audio>                  	
                                    </div>
                                </div>

                                <div class="entry-text">
                                    <div class="entry-header">

                                        <div class="entry-meta">
                                            <span class="cat-links">
                                                <a href="#">Design</a> 
                                                <a href="#">Music</a>                				
                                            </span>			
                                        </div>

                                        <h1 class="entry-title"><a href="single-audio.html">This Is a Audio Format Post.</a></h1>
                                        
                                    </div>
                                            <div class="entry-excerpt">
                                                Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                            </div>
                                </div>
                            
                            </article>

                            <article class="brick entry format-quote animate-this">

                            <div class="entry-thumb">                  
                                <blockquote>
                                        <p>Good design is making something intelligible and memorable. Great design is making something memorable and meaningful.</p>

                                        <cite>Dieter Rams</cite> 
                                </blockquote>	          
                            </div>   

                                </article>

                            <article class="brick entry format-standard animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/shutterbug.jpg" alt="Shutterbug" />                      
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Photography</a> 
                                            <a href="#">html</a>                				
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">Photography Skills Can Improve Your Graphic Design.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                            <article class="brick entry format-standard animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/usaf-rocket.jpg" alt="USAF rocket" />                      
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Branding</a> 
                                            <a href="#">Mockup</a>               				
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">The 10 Golden Rules of Clean Simple Design.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                                <article class="brick entry format-gallery group animate-this">

                            <div class="entry-thumb">

                                <div class="post-slider flexslider">
                                            <ul class="slides">
                                                <li>
                                                    <img src="images/thumbs/gallery/work1.jpg" /> 
                                                </li>
                                                <li>
                                                    <img src="images/thumbs/gallery/work2.jpg" /> 
                                                </li>
                                                <li>
                                                    <img src="images/thumbs/gallery/work3.jpg" /> 
                                                </li>
                                            </ul>							
                                        </div> 

                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Branding</a> 
                                            <a href="#">Wordpress</a>               				
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-gallery.html">Workspace Design Trends and Ideas.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                                <article class="brick entry format-link animate-this">

                            <div class="entry-thumb">
                                <div class="link-wrap">
                                        <p>Looking for affordable &amp; reliable web hosting? We recommend Dreamhost.</p>
                                        <cite>
                                            <a target="_blank" href="http://www.dreamhost.com/r.cgi?287326">http://www.dreamhost.com</a>
                                        </cite>
                                </div>	
                            </div>               
                            
                                </article>


                            <article class="brick entry animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/diagonal-pattern.jpg" alt="Pattern" />              
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Design</a> 
                                            <a href="#">UI</a>                			
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">You Can See Patterns Everywhere.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                                <article class="brick entry format-video animate-this">

                            <div class="entry-thumb video-image">
                                <a href="http://player.vimeo.com/video/14592941?title=0&amp;byline=0&amp;portrait=0&amp;color=F64B39" data-lity>
                                    <img src="images/thumbs/ottawa-bokeh.jpg" alt="bokeh" />                   
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Design</a> 
                                            <a href="#">Branding</a>               			
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-video.html">This Is a Video Post Format.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article> 

                                <article class="brick entry format-standard animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/lighthouse.jpg" alt="Lighthouse" />                      
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Photography</a> 
                                            <a href="#">Design</a>
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">Breathtaking Photos of Lighthouses.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                                <article class="brick entry format-standard animate-this">

                            <div class="entry-thumb">
                                <a href="single-standard.html" class="thumb-link">
                                    <img src="images/thumbs/liberty.jpg" alt="Liberty" />                      
                                </a>
                            </div>

                            <div class="entry-text">
                                <div class="entry-header">

                                    <div class="entry-meta">
                                        <span class="cat-links">
                                            <a href="#">Branding</a> 
                                            <a href="#">html</a>                	
                                        </span>			
                                    </div>

                                    <h1 class="entry-title"><a href="single-standard.html">Designing With Black and White.</a></h1>
                                    
                                </div>
                                        <div class="entry-excerpt">
                                            Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.
                                        </div>
                            </div>
                            
                                </article>

                        </div>

                    </div>
                
                </section>


                <Modal show={this.state.deleteSiteIndex!==null}>
                    <h3><Bundle message="SITES_DELETE_MESSAGE" /></h3>
                    <Button btnType="Success" clicked={this.removeSite}><Bundle message="YES" /></Button>
                    <Button btnType="Danger" clicked={this.cancelDelete}><Bundle message="NO" /></Button>
                </Modal>    
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        token : state.auth.token,
        canDelete : state.auth.role === 'admin',
        canEdit : state.auth.role === 'admin' || state.auth.role === 'editor',
        userId : state.auth.userId,
        lastSitesLoaded : state.site.lastSitesLoaded,
        lastCategory : state.site.category,
        isAuthenticated: state.auth.token !== null,
        lastFilter : state.site.filterCriteria,
        sitesCashed : state.site.sitesCashed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchCategories: (categories) => dispatch({
            type: categoryActionTypes.FETCH,
            categories: categories
        }),
        onFetchSites: (sitesLoaded,selectedCategory) => dispatch({
            type: siteActionTypes.FETCH_SITES,
            sites: sitesLoaded,
            category : selectedCategory
        }),
        onSiteEdit: (siteToEdit) => dispatch({
            type: siteActionTypes.SITE_EDIT,
            site:siteToEdit
        }),
        onSetCategory: (category) => dispatch({
            type: siteActionTypes.SET_CATEGORY,
            category:category
        }),
        onDeleteSite: (siteKey) => dispatch({
            type: siteActionTypes.DELETE_SITE,
            key: siteKey
        }),
        onFilterSites: (filterCriteria) => dispatch({
            type: siteActionTypes.FILTER_SITES,
            search:filterCriteria,
        }),
        onUpdateSite: (site) => dispatch({
            type: siteActionTypes.UPDATE_SITE,
            site: site
        })
    };
};





export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Home,axios));