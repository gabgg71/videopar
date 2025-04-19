import React, { useContext} from 'react'
import { Datos } from './Datos'
import { userContext } from '../hooks/useContext';

const videoImg = process.env.REACT_APP_IMG_URL;
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
        <img src={videoImg} className='imagen' alt='img'></img>
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