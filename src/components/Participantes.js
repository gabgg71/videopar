import React, { useContext, useState } from 'react';
import { userContext } from '../hooks/useContext';
const Participantes =()=>{
    let {usuario, conectados} = useContext(userContext);



    return (
        <div className="elChat">
    <div className="participantes">
            <b>Participantes</b>   
            {conectados.map((obj, ind)=>(
                <div className="participante" key={ind}>
                <p>{obj}</p>
            </div> 
            ))} 
    
    </div>
    
    </div>
    );

}
export default Participantes