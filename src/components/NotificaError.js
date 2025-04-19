const NotificaError =({errorMsg, setErrorMsg})=>{
    return(
        <div className="deviceError">
            <button type="button" className="btn-close" aria-label="Close" onClick={()=>{setErrorMsg("")}}>X</button>
            <p>{errorMsg}</p>
        </div>
    )

}
export default NotificaError;