import React,{Component} from 'react';

import SelectCategory from '../../components/SelectCategory/SelectCategory';

import axios from '../../axios';

import './Home.css';

class Home extends Component {

    state = {
        categories : []
    }

    componentDidMount= () => {
        axios.get('/categories.json')
        .then(response => {
            this.setState({categories:response.data})
        })

    }

    render(){
        return (
            <div className="Home">
                <h1>Veja como o mundo esta mudando</h1>
                <p>
                <SelectCategory categories={this.state.categories}/>
                </p>
            </div>    
        )
    }
}

export default Home;