import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../hooks/useContext';
import { Opciones } from './Opciones';


const Chat = props => {
  const [message, setMessage] = useState('')
  const [opcion, setOpcion] = useState(false)
  const [openDoc, setOpen] = useState(-1)
  let { usuario, messages } = useContext(userContext);

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [props])

  const sendMessage = (msgMio, msgEnviar) => {
    props.sendMessage(msgMio, msgEnviar);
    scrollToBottom()
  }

  const handleSubmit = (event, mensaje, msgMio) => {
    if (message !== '') {

      event.preventDefault();
      sendMessage({ type: 'text', message: { sender: usuario, data: { text: message } } }, { type: 'text', message: { sender: usuario, data: { text: message } } })
      setMessage('')
    }
    if (message === '') {
      if (event && msgMio.data.currentChunkIndex ===0) {
        if (msgMio.data.doc.substring(5, 8) === "ima") {
          sendMessage({ type: 'img',message:msgMio}, { type: 'img', message: mensaje.message })
        } else if (msgMio.data.doc.substring(5, 8) === "vid") {
          sendMessage({ type: 'video', message: msgMio }, { type: 'video', message: mensaje.message })
        } else {
          sendMessage({ type: 'doc', message: msgMio }, { type: 'doc', message: mensaje.message })

        }
      }else if(event && msgMio.data.currentChunkIndex >0){
        if (msgMio.data.doc.substring(5, 8) === "ima") {
          sendMessage(null, { type: 'img', message: mensaje.message })
        } else if (msgMio.data.doc.substring(5, 8) === "vid") {
          sendMessage(null, { type: 'video', message: mensaje.message })
        } else {
          sendMessage(null, { type: 'doc', message: mensaje.message })

        }


      }
      return
    }

  };

  const handleChange = event => {
    setMessage(event.target.value)
  }

  const renderMessage = (userType, data, ind) => {
    const message = data.message



    const msgDiv = data.type === 'text' && (
      (userType === "self") ? (<div className="msg right">
        <b>{data.message.sender}</b>
        <div className="message"> {data.message.data.text}</div>
      </div>) : (<div className="msg left">
        <b>{data.message.sender}</b>
        <div className="message"> {data.message.data.text}</div>
      </div>)

    ) || (data.type === 'img' && (
      <img className='img-1 image-chat' onClick={abrir} src={message.data.doc}></img>
    )) || (data.type === 'video' && (
      <video className='img-1 image-chat' src={message.data.doc} controls></video>
    )) || (data.type === 'doc' && openDoc === ind && (
      <div className={'doc'+ind+' doc-large'}>
        <button className='btn-cerrar' onClick={()=>{setOpen(-1)}}>X</button>
        <embed
          src={message.data.doc}
        ></embed>
      </div>
    )) || (data.type === 'doc' && (
      <>
      <div className={'doc'+ind+' doc-small'}>
        <p>{message.data.nombre}</p>
        <button onClick={()=>{setOpen(ind)}} className='abrir'>Abrir</button>
      </div>
      {data.problem && <p className='problema'>El archivo excede el tamaño soportado, posteriormente se trabajara en esto</p>}
      </>
    ))

    return msgDiv

  }



  const abrir = (e) => {
    let imagen = e.target
    if (imagen.classList.contains("image-chat")) {
      imagen.classList.replace("image-chat", "image-large")
    } else {
      imagen.classList.replace("image-large", "image-chat")
    }
  }

  return (
    <div className='elChat'>



      <div className="chat" id="chatList">
        {messages.map((data, ind) => (


          <div key={ind}>
            {usuario === data.message.sender ? renderMessage("self", data, ind) : (renderMessage('other', data, ind))}
          </div>

        ))}



      </div>
      {opcion && <Opciones handleSubmit={handleSubmit} setOpcion={setOpcion} />}



      <div className='escribir'>
        <button onClick={() => { setOpcion(!opcion) }}>
          <span className="material-symbols-outlined">
            add
          </span>
        </button>
        <form onSubmit={handleSubmit}>
          <input
            className="textarea input"
            type="text"
            placeholder="Escribe el mensaje"
            onChange={handleChange}
            value={message}
          />
        </form>
        <button onClick={handleSubmit}>
          <span className="material-symbols-outlined">
            send
          </span>
        </button>
      </div>



    </div>
  )
}

export default Chat