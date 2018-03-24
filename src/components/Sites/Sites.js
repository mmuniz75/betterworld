import React from 'react';

import './Sites.css';

const Sites = (props) => (
    <div style={!props.show?{display:'none'}:null}>
        <table border="1">
            <tbody>
                <tr>
                    <th>Nome</th>
                    <th>Descricao</th>
                    <th>Site</th>
                </tr>

                {props.sites?props.sites.map(site => {
                    return (
                        <tr key={site.nome} >
                            <td>{site.nome}</td>
                            <td><textarea rows="5" cols="100" readOnly
                                    value={site.descrição}
                                />
                            </td>
                            <td><a target="blank" href={site.site}>{site.site}</a></td>
                        </tr>
                    )
                    }      
                  ):null
                }
            </tbody>    
        </table>
    </div>    
)

export default Sites;