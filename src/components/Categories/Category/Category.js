import React from 'react';

import classes from './Category.css';

import Auxliary from '../../../hoc/Auxiliary/Auxiliary';

const category = (props) => {
    
    const approvation = props.approveClicked && props.rejectClicked;

    const image = props.logo? <a className={classes.ProductPhoto}>
                                <img src={props.logo} height="160" width="160" alt={props.Category}/>
                            </a>
                    :null          
    
    const buttons = approvation
                    ?<Auxliary>
                        <button className={classes.ButtonApprove}
                                onClick={() => props.approveClicked(props.index)}
                                >Approve</button>
                        &nbsp;
                        <button className={classes.ButtonReject}
                                onClick={() => props.rejectClicked(props.index)}
                                >Reject</button>
                    </Auxliary>
                    :null;

    const categoryLabel = approvation
                            ?<Auxliary>
                                   (<b>Categoria:&nbsp;</b>{props.category})
                            </Auxliary>
                            :null;                
    const editLinks = props.auth
                      ?<Auxliary>
                        <a onClick={() => props.edit(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-edit fa-lg" title='Editar Category' />
                        </a>
                        &nbsp;&nbsp;&nbsp;
                        <a onClick={() => props.delete(props.index)} style={{cursor: 'pointer'}} >
                            <i className="fas fa-trash fa-lg" title='Remover Category' />
                        </a>
                       </Auxliary> 
                      :null

    const location = props.location                  
                     ?<i>({props.location})</i>
                     :null
    return (
        <Auxliary>
            {image}
            <div className={classes.ProductDetails}>
                <h2>{props.name}</h2>
                <br/>
                {editLinks}
                {categoryLabel}
                <p className={classes.ProductDescription}>{props.description}</p>
                <p className={classes.Location}>{location}</p>
                <br/>
                <button className={classes.RegularButton} 
                          onClick={() => window.open(props.Category)}>Veja mais</button>   
                <br/><br/>
                {buttons}
                
                {/*
                &nbsp;
                <button onClick={() => props.edit(Category.id)}>Editar</button>
                */}
            </div>
        </Auxliary>
    )
}      
export default Category;