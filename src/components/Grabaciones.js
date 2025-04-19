
import React from 'react';
export const Grabaciones =({recordedBlobs})=>{

    const reproduce =(blob)=>{
        const recordedVideo = document.querySelector('#recorded');
        if(recordedVideo.classList.contains("none")){
            recordedVideo.classList.remove("none")
        }
        recordedVideo.src = window.URL.createObjectURL(blob);
        recordedVideo.play();
    }

    const descargar =(blob, ind)=>{
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'videopar-record'+ind+'.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    return (
        <div className="elChat">
        <div className="grabaciones">
            <b>Tus grabaciones</b> 
            <video id="recorded" autoPlay controls className='image-chat none'></video>
            {recordedBlobs.map((obj, ind)=>(
                <div className="escribir" key={ind}>
                <p> Record {ind}</p>
                <button onClick={()=>{reproduce(obj)}}><span className="material-symbols-outlined">
                    not_started
        </span></button>
                    <button onClick={()=>{descargar(obj, ind)}}><span className="material-symbols-outlined">
        download
        </span></button>
            </div> 
            ))} 
            
        </div>
        
        </div>
    )


}