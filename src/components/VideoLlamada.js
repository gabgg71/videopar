import React, { useRef, useEffect, useState, useContext } from 'react';
import { userContext } from '../hooks/useContext';

import io from 'socket.io-client'
//import Draggable from './components/Draggable';
import Chat from './Chat'
import Participantes from './Participantes'
import Invita from './Invita';
import Preguntas from './Preguntas';
import { Grabaciones } from './Grabaciones';
import NotificaError from './NotificaError';

const socket = io(
  process.env.REACT_APP_BACK_URL,
  {
    path: '/webrtc',
    query:{
      room:window.location.pathname
    }
  }
)

function VideoLlamada() {
    const localVideoref = useRef();
    const remoteVideoref = useRef();
    const [llamar, setVisible] =useState(true)
    const [invita,setInvita] =useState(false)
    const [errorMsg, setErrorMsg] =useState("");
    const [hasCamera, setHasCamera] =useState(true);
    const [hasMic, setHasMic] =useState(true);
    const [preguntas,setPreguntas] =useState(false)
    const [condiciones, setCondiciones] =useState({
      mic: false, 
      camera: false,
      share: false,
      record: false
    })
    
    let recordedBlobs = []
    const [records, setRecords] =useState([])
    
    const [solo, setSolo] =useState(true)
    const [opcion, setOpcion] =useState(0)
    //0 es empezar 1 pausar 2 resumir 3 terminar
    const [estadoGrabar, setEstadoG] =useState(0)
    const [mensaje, setMensaje] =useState(0)
    const [mediaRec, setmediaRec] =useState(null)
    
    const [sendChannels, setSendChannels] =useState([])
    
    const [clases, setClases] =useState(["focus", "secondary", "et1", "et2"])
    const chunks = new Map();
   /* const {state} = useLocation();
    const { usuario} = state;*/
    let { usuario, setUsuario,messages, setMessages, conectados, setConectados} = useContext(userContext);
    
    
    


    const pc_config = {
      "iceServers": [
        {
          urls : 'stun:stun.l.google.com:19302'
        }
      ]
    }
    const pc = useRef(new RTCPeerConnection(pc_config));

    const enviar =(eventType, payload)=>{
      socket.emit(eventType, payload)

    }

    const whoisOnline = () => {
      // Enviar notificacion a los que estan conectados para que sepan que me conecte
      enviarAPares('onlinePeers', null, {local: socket.id})
    }

    //emitir diferentes eventos al servidot
    const enviarAPares =(messageType, payload, socketID)=>{
      socket.emit(messageType, {
        socketID,
        payload
      })
    }

    const mutearAudio = (e) => {
      if(hasMic){
        const stream = localVideoref.current.srcObject.getTracks().filter(track => track.kind === 'audio')
        if (stream){
          stream[0].enabled = !condiciones.mic
          setCondiciones({...condiciones, mic: !condiciones.mic})
        } 
      }else{
        setErrorMsg("Su microfono no esta conectado, conectelo y acceda de nuevo");
      }
    
    }

    const desconectar =()=>{
     
      //sendChannels[0] = null
      sendChannels.map(s =>{
        s.close()
      })
      pc.current.close()
      //pc.current.close()
      setSendChannels([])
      window.location.href = window.location.origin+"/videopar/fin"
      
    }
  
    const mutearCamera = (e) => {
      if(hasCamera){
        const stream = localVideoref.current.srcObject.getTracks().filter(track => track.kind === 'video')
        if (stream){
          stream[0].enabled = !condiciones.camera
          setCondiciones({...condiciones, camera: !condiciones.camera})
        }
      }else{
        setErrorMsg("No tiene camara, conectela y acceda de nuevo");
      }
    }

    const compartirPantalla =()=> {
      const constraints = { video: { cursor: 'always' }, audio: true};
      navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
        const screenTrack = stream.getVideoTracks()[0];
        pc.current.getSenders().find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
        screenTrack.onended = function() {
          pc.current.getSenders().find(sender => sender.track.kind === "video").replaceTrack(localVideoref.current.srcObject.getTracks()[1]);
        }
    })

  }

  const handleSendChannelStatusChange = (event) => {
    console.log('send channel status: ' + sendChannels[0].readyState)
  }

  const receiveChannelCallback = (event) => {
    const receiveChannel = event.channel
    receiveChannel.onmessage = handleReceiveMessage
    receiveChannel.onopen = handleReceiveChannelStatusChange
    receiveChannel.onclose = handleReceiveChannelStatusChange
  }
  //recibir un mensaje
  const handleReceiveMessage = (event) => {
    const msg = JSON.parse(event.data)
    if(msg.type !=="text" && msg.message.data.size > 15000){
  
  const {nombre,currentChunkIndex,totalChunks, doc} = msg.message.data;
  if(parseInt(currentChunkIndex) === 0){
    chunks.set(nombre, doc);
  }else{
    if(parseInt(currentChunkIndex) === parseInt(totalChunks) -1){
      chunks.set(nombre, chunks.get(nombre)+doc);
      msg.message.data.doc = chunks.get(nombre)
      setMessages(messages =>[...messages, msg])
    }else{
      chunks.set(nombre, chunks.get(nombre)+doc);
    }
  }
}else{
  setMessages(messages =>[...messages, msg])
}
  }

  const handleReceiveChannelStatusChange = (event) => {
    if (this.receiveChannel) {
      console.log("receive channel's status has changed to " + this.receiveChannel.readyState);
    }
  }

    useEffect(() => {

      if(conectados.length===0){
        setConectados([usuario])
      }

      socket.on("connection-success", success =>{
        
      })

      socket.on('joined-peers', data => {
        setMensaje("Alguien se conecto haz una llamada")
      })


      socket.on('peer-disconnected', data => {
        
        setClases(["focus", "secondary", "et1", "et2"])
        remoteVideoref.current.srcObject = null;
        setSolo(true)
        sendChannels.map(s => {
          s.close();
          s = null;
        }
        )
        //pc.close()
        
        setSendChannels([])
        setConectados([usuario])

        setMensaje("Esperando a que alguien se conecte")
      })

      socket.on('online-peer', socketID => {
        createOffer()
        setMensaje("Alguien se conecto haz una llamada")


      })
      //enviar el canal
      
      //recibo  informacion sdp del otro cliente
      socket.on('sdp', (data)=>{
        //console.log(`la data que recibi ${JSON.stringify(data)}`)
        if(conectados.length <=2){
          setConectados(conectados => [...conectados, data.data.usuario])
          //cuando recibo sdp lo establezco como remoto
          pc.current.setRemoteDescription(new RTCSessionDescription(data.data.sdp))
          //recibi oferta y abro canal para chat
          if(data.data.sdp.type === "offer"){
            //el cliente b recibe sdp de a, debe decir responder
            const sendChannel = pc.current.createDataChannel('sendChannel')
            sendChannel.onopen = handleSendChannelStatusChange
            sendChannel.onclose = handleSendChannelStatusChange
            
            setSendChannels([...sendChannels, sendChannel])
            pc.current.ondatachannel = receiveChannelCallback
            setVisible(false)
            createAnswer()
            setMensaje("Llamada entrante")
          }else{
            setVisible(true)
            setMensaje("Llamada establecida")
           /* enviar('info', {
              usuario: usuario
            })*/
          }
        }
        })

      socket.on('candidate', candidate => {
        if(candidate.data && pc.current.remoteDescription){
          pc.current.addIceCandidate(new RTCIceCandidate(candidate.data))

        }
      })

      setCondiciones({...condiciones, mic: sessionStorage.getItem("aud"), camera: sessionStorage.getItem("cam")});
      navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasCamera = devices.some(d => d.kind === 'videoinput');
        const hasMic = devices.some(d => d.kind === 'audioinput');
        setHasCamera(hasCamera);
        setHasMic(hasMic);
        if (!hasCamera || !hasMic) {
          setCondiciones({...condiciones, mic: hasMic, camera: hasCamera});
          setErrorMsg(`Dispositivos no detectados: ${!hasCamera ? 'Cámara' : ''} ${!hasMic ? 'Micrófono' : ''}`)
        }

      const constrains = {
        video: hasCamera ? true: false,
        audio: hasMic ? {
          echoCancellation: true,
          noiseSuppression: true
        } : false
      };
      return navigator.mediaDevices.getUserMedia(constrains);
    }).then(
        stream => {
            localVideoref.current.srcObject = stream;
            stream.getTracks().forEach(track =>{
              if(track.kind === 'audio' && hasMic){
                track.enabled = sessionStorage.getItem("aud") === 'true';
              }
              if(track.kind === 'video' && hasCamera){
                track.enabled = sessionStorage.getItem("cam") === 'true';
              }
              pc.current.addTrack(track, stream)
          })
          whoisOnline()
        }
      ).catch(e => {
        console.log(`hay error ${e}`)
      })

     

      const _pc = new RTCPeerConnection(null)
      _pc.onicecandidate = (e) => {
        if (e.candidate) {
          enviar('candidate', e.candidate)

        }
      }

      _pc.oniceconnectionstatechange = (e) => {
        if(solo === false && clases[0]==="focus"){
          setClases(["secondary", "focus", "et2", "et1"])
          setMensaje("Llamada establecida")
        }
      }
      
      _pc.ontrack = (ev) => {
        remoteVideoref.current.srcObject = ev.streams[0];
      }
      pc.current = _pc;

      const handleUnload = () => {
        sessionStorage.removeItem("aud");
        sessionStorage.removeItem("cam");
      };
  
      window.addEventListener('beforeunload', handleUnload);
  
      return () => {
        handleUnload()
        window.removeEventListener('beforeunload', handleUnload);
      };

    }, [])

    
    //si voy a enviar oferta abro dta channel
    const createOffer = () => {
      const sendChannel = pc.current.createDataChannel('sendChannel')
      sendChannel.onopen = handleSendChannelStatusChange
      sendChannel.onclose = handleSendChannelStatusChange
      setSendChannels([...sendChannels, sendChannel])
      pc.current.ondatachannel = receiveChannelCallback

      setMensaje("Esperando respuesta")
      pc.current.createOffer({
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 1
      })
        .then(sdp => {
          procesarSDP(sdp, usuario)
        }, e => { console.log(e) })
    }
    const createAnswer = () => {
      
      pc.current.createAnswer({ 
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 1
       })
        .then(sdp => {
          procesarSDP(sdp, usuario)

        }, e => {console.log(e) })
      
    }

    function handleDataAvailable(event) {
      console.log('handleDataAvailable', event);
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    const grabar =async()=>{
      if(estadoGrabar > 0){
        mediaRec.stop();
        setEstadoG(0)
      }else{
        const constraints = {
          audio: {
            echoCancellation: {exact: true}
          },
          video: {
            width: 1280, height: 720
          }
        };
       
        try {
          const stream = (clases[0] ==="focus")?(localVideoref.current.srcObject):(remoteVideoref.current.srcObject)
          window.stream = stream;
          const options = { mimeType: "video/webm; codecs=vp9" };
          const mediaRecorder = new MediaRecorder(window.stream, options);
          setmediaRec(mediaRecorder)
          mediaRecorder.start();
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = (event) => {
          console.log('Recorder stopped: ', event);
          
          console.log('Recorded Blobs: ', recordedBlobs);
          setRecords([...records, ...recordedBlobs])
        };
        setEstadoG(1)
        } catch (e) {
          console.error('Exception while creating MediaRecorder:', e);
          
          return;
        }
        
      }

      

    }




    const procesarSDP = (sdp, usuario)=>{
          pc.current.setLocalDescription(sdp)
          //enviar sdp al servidor de senalizacion
          enviar('sdp', {sdp,usuario})
          
    }


    


    return (
      <div className="App">
        <div className='videos'>
        <video className={clases[0]}
          ref={localVideoref}
          onClick={()=>{setClases(["focus", "secondary", "et1", "et2"])}}
          autoPlay>
            
        </video>
        <p className={clases[2]}>{usuario}</p>
        {conectados[1] && 
<>

        <video
          ref={remoteVideoref}
          className={clases[1]}
          onClick={()=>{setClases(["secondary", "focus", "et2", "et1"])}}
          autoPlay>
            
        </video>
        <p className={clases[3]}>{conectados[1]}</p>
        </>

        
        }
        {errorMsg !== "" && <NotificaError errorMsg={errorMsg} setErrorMsg={setErrorMsg}/>}
        {invita && <Invita setInvita={setInvita}/>}
        {preguntas && <Preguntas setPreguntas={setPreguntas}/>}


        </div>
        <div className='controles'>
          <div className='centrado'>
        <button onClick={()=>{mutearAudio()}} className='controls audio' style={{backgroundColor: (condiciones.mic && "rgb(210, 212, 213)") || "red"}}>
        <span className="material-symbols-outlined">
        volume_mute
        </span>
        </button>
        <button onClick={mutearCamera} className='controls camera' style={{backgroundColor: (condiciones.camera &&"rgb(210, 212, 213)") || "red"}}>
        <span className="material-symbols-outlined">
        video_camera_front
        </span>
        </button>
        <button onClick={grabar} className='controls camera' style={{backgroundColor: (estadoGrabar===0 && "rgb(210, 212, 213)") || "red"}}>
        <span className="material-symbols-outlined">
        radio_button_checked
        </span>
        </button>
        <button onClick={compartirPantalla} className='controls camera' style={{backgroundColor: (condiciones.share &&"red") || "rgb(210, 212, 213)"}}>
        <span className="material-symbols-outlined">
        present_to_all
        </span>
        </button>
        <button onClick={()=>{setOpcion(0)}} className='controls camera' style={{backgroundColor: "rgb(210, 212, 213)"}}>
        <span className="material-symbols-outlined">
        chat
        </span>
        </button>
        <button onClick={()=>{setOpcion(1)}} className='controls camera' style={{backgroundColor: "rgb(210, 212, 213)"}}>
        <span className="material-symbols-outlined">
        <span className="material-symbols-outlined">
        groups
        </span>
        </span>
        </button>
        <button onClick={()=>{setOpcion(2)}} className='controls camera'>
        <span className="material-symbols-outlined">
        sync_saved_locally
        </span>
        </button>
        <button onClick={desconectar} className='controls camera' style={{backgroundColor: "red"}}>
        <span className="material-symbols-outlined">
        call_end
        </span>
        </button>
        </div>
        <button  onClick={()=>{setInvita(true)}} className='invita-btn'>Invita</button>
        <button  onClick={()=>{setPreguntas(true)}} className='preguntas-btn'>Preguntas</button>

        </div>
        {opcion ===0 && <Chat
          sendMessage={(msgMio, msgEnviar) => {
            if(msgMio){
            setMessages([...messages, msgMio])
          }
            sendChannels.map(sendChannel => {
              sendChannel.readyState === 'open' && sendChannel.send(JSON.stringify(msgEnviar))
            })
          }}
        />}
        {opcion ===1 && <Participantes usuario={usuario} conectados ={conectados}/>}
        {opcion ===2 && <Grabaciones recordedBlobs={records}/>}
        
       
      </div>
    );
  }


export default VideoLlamada;
