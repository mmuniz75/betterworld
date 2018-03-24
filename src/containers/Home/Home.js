import React,{Component} from 'react';

import SelectCategory from '../../components/SelectCategory/SelectCategory';

import axios from '../../axios';

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
            <div>
                <SelectCategory categories={this.state.categories}/>
            </div>    
        )
    }
}

export default Home;