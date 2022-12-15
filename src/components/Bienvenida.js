import React, { useState, useContext} from 'react'
import { Datos } from './Datos'
import { userContext } from '../hooks/useContext';
export const Bienvenido =()=>{
    let {datos,setDatos} = useContext(userContext);
    
    
    return(
        <>
        <div className='App'>
        <div className='titulo'>
        <h1>Videopar</h1>
        </div>
        
        <div className='pagina'>
        <div className='publi'>
            <p></p>
        </div>
        <div className='flexi'>
        <h2>Videollamadas en pares fácil, rápido y sin necesidad de registro</h2>
        <img src='https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2020/04/skype-1909379.jpg' className='imagen'></img>
        <button className="btn-morado" onClick={()=>setDatos(true, 1)}>Crear reunión</button>
        {datos && <Datos setDatos={setDatos} tipo={1}/>}
        </div>
        <div className='publi'>
        <p></p>
        </div>
        </div>
        <div className='titulo'>
        <p className='author'>Por Gabriela Galindo</p>
        </div>
        </div>
        </>
    )

}