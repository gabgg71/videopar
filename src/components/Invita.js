const Invita =({setInvita})=>{
    return(
        <div className="invita">
            <button type="button" className="btn-close" aria-label="Close" onClick={()=>{setInvita(false)}}>X</button>
            <p>Envia este enlace a un amigo: </p>
    <div className='enlace'>
        <p>{window.location.href}</p>
        
        <button className='copiar'>
            <span className="material-symbols-outlined" onClick={()=>{navigator.clipboard.writeText(window.location.href);}}> <span class="material-symbols-outlined">
file_copy
</span>
        </span></button></div>
        </div>
    )

}
export default Invita