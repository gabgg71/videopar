import { v4 as uuidv4 } from 'uuid';
import React, { useState, useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { userContext } from '../hooks/useContext';


export const Datos =({setDatos, tipo})=>{
    const [mensaje, setMensaje] = useState((tipo ===1)?('Generar enlace'):("Entrar a la sesion"))
    const [codigo, setCodigo] = useState()
    let opcion = [false, false]
    //const [opcion, setOpcion] = useState([false, false])

    
    const [error, setError] = useState()
    let { usuario, setUsuario } = useContext(userContext);
    
    function verifica (){
        if(mensaje ==="Generar enlace"){
            let usuario = document.querySelector(".user")
        let generado = uuidv4();
        if(usuario.value){
            setCodigo("session/"+generado)
            setUsuario(usuario.value)
            setMensaje("Entrar a la sesion")
        }else{
            setError("Debe colocar el nombre")
            setTimeout(()=>{
                setError()
            }, 2000)
        }
        }else{
            if(tipo === 2){
                let usuario = document.querySelector(".user")
                if(usuario.value){
                    setUsuario(usuario.value)
                    //navigate(".", { state: { usuario: usuario }, authorized: true});
                }else{
                    setError("Debe colocar el nombre")
                    setTimeout(()=>{
                        setError()
                    }, 2000)
                }

            }else{
                localStorage.setItem('usuario', usuario);
                window.location.href =window.location.href+codigo
            }
            
        }
        
        
    }

    const copyToClipboard =()=> {
        //window.prompt("Copy to clipboard: Ctrl+C, Enter", codigo);
        
        navigator.clipboard.writeText(window.location.href+codigo);
    }

    
    return (
        <>
        <div className="datos">
            <button type="button" className="btn-close" aria-label="Close" onClick={()=>{setDatos(false)}}>X</button>
            <div className="sep">
            <p>Escribe tu nombre</p>
            <input type="text" className='user'></input>
            {error && <p className='error'>{error}</p>}
            {(codigo || tipo === 2)&& <>
            {codigo &&
            <>
            <p>Este es el enlace de la sesión</p>
            <div className='enlace'>
            <p>{window.location.href+codigo}</p>
            <button className='copiar'><span className="material-symbols-outlined" onClick={copyToClipboard}> 
        <span class="material-symbols-outlined">
file_copy
</span>
    </span></button></div>
    </>
            }
            
        <div className='escribir'>
        <div className='btn-switch'>
        <p>Audio</p>
        <input type="checkbox" id="miSwitch" onClick={()=>{
            sessionStorage.setItem('aud', !opcion[0]);
            opcion[0] = !opcion[0]
            }}/>
        </div>
        <div className='btn-switch'>
        <p>Camara</p>
        <input type="checkbox" id="miSwitch" onClick={
            ()=>{
                sessionStorage.setItem('cam', !opcion[1]);
                opcion[1] = !opcion[1]
                }
            }/>
        </div>
        </div>
</>}
            
            <button className="btn-morado" onClick={verifica}>{mensaje}</button>
            </div>

        </div>
        </>
    )
}