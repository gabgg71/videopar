import React, {useState} from 'react';
const Preguntas =({setPreguntas})=>{
    const [selecc, setMostrar] =useState(-1)
    let preguntas = ["¿Cómo puedo enfocar el video de un participante?", "¿Cómo puedo grabar el video de uno de los participantes", "Restricciones al enviar archivos por el canal de datos", "¿Cómo cerrar imagen en pantalla completa?"]
    let respuestas = ["Has click sobre el video de ese participante.", 
    "Enfoca al participante, presionar el botón de grabar y mira tus grabaciones en la opción habilitada para esto.", 
    "Puedes enviar archivos de cualquier tamaño sin embargo si envías un archivo de más de 1 MB tendrá un retardo considerable, dado que los archivos no se comprimen previamente, esta característica se agregara posteriormente.",
     "Has click sobre la imagen."]
    return (
        <>
        <div className="datos">
        <button type="button" className="btn-close" aria-label="Close" onClick={()=>{setPreguntas(false)}}>X</button>
        <div className='m-preguntas'>


       
        {preguntas.map((pregunta, index)=>(
            <>
            <button className="btn-pregunta" onClick={()=>{(index===selecc)?(setMostrar(-1)):(setMostrar(index))}} key={index}>{pregunta}  
        <span className="material-symbols-outlined">
expand_more
</span></button>
{selecc === index &&
<div className="respuesta" key={index+"r"}>
    <p>{respuestas[index]}</p>
</div>}
</>
        ))}
        </div>
        </div>
        </>
    )

}
export default Preguntas