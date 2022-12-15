import React, {useContext, useState } from 'react'
import {userContext} from '../hooks/useContext';
export const Opciones =({handleSubmit, setOpcion})=>{
    let {usuario} = useContext(userContext);
    const chunkSize = 11 * 1024;


    const leer =(opcion)=>{
        setOpcion(false);
        let archivos
        if(opcion ===1){
            archivos = document.querySelector(".filesI");
        }else if(opcion ===2){
            archivos = document.querySelector(".filesV");
        }else{
            archivos = document.querySelector(".filesD");
        }
        if (archivos.files && archivos.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
            let count =0
            const intervalId = setInterval(() => {
                readAndUploadCurrentChunk(e.target.result, count, archivos.files[0]);
                count+=1;
                let limits = Math.ceil(e.target.result.length / chunkSize)
                if(count === limits) {
                    clearInterval(intervalId);
                }
                }, 130);
            };
            reader.readAsDataURL(archivos.files[0]);
          }
    }

    function readAndUploadCurrentChunk(data, currentChunkIndex, archivo) {
        if (!data) {
          return;
        }
        const from = currentChunkIndex * chunkSize;
        let to;
        if(from + chunkSize > data.length) {
            to = from + (data.length -from);
        }else{
            to = from + chunkSize;
        }
        const slice = data.slice(from, to);
        uploadChunk(slice, currentChunkIndex, archivo, data);
      }
    
      function uploadChunk(readerEvent, currentChunkIndex, file, archivo) {   
        let mensaje = { 
        message: { sender: usuario,
            data: { doc: readerEvent, 
                nombre: file.name, 
            size: file.size, 
            currentChunkIndex: currentChunkIndex,
            totalChunks: Math.ceil(archivo.length  / chunkSize)
        } }, 
            problem: true }
        handleSubmit(readerEvent, mensaje, { sender: usuario,
            data: { doc: archivo, 
                nombre: file.name, 
            size: file.size, 
            currentChunkIndex: currentChunkIndex,
            totalChunks: Math.ceil(archivo.length  / chunkSize)
        } })

           
      }
/*
      <button onClick={()=>{document.querySelector(".filesV").click();}}>Seleccionar video</button>
      <input type="file" className="filesV" onChange={()=>{leer(2)}} hidden accept="video/*"></input>*/
   
    return (
        <div className="enviarM">
            <button onClick={()=>{document.querySelector(".filesI").click();}}>Seleccionar imagen</button>
            <button onClick={()=>{document.querySelector(".filesD").click();}}>Seleccionar archivo</button>
            <input type="file" className="filesI" onChange={()=>{leer(1)}} hidden accept="image/*"></input>
            <input type="file" className="filesD" onChange={()=>{leer(3)}} hidden accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></input>
        </div>
    )

}

