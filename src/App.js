import React, { useContext, useState } from 'react';
import { AppRouter } from './router/AppRouter';
import { userContext } from './hooks/useContext';

const App =()=> {
  let [usuario, setUsuario] =useState()
  const [datos, setDatos] = useState(false)
  const [messages, setMessages] =useState([])
  const [conectados, setConectados] =useState([])
  return (
    <userContext.Provider value={{usuario, setUsuario,datos, setDatos, messages, setMessages, conectados, setConectados}}>
      <AppRouter/>
    </userContext.Provider>
  )
}

export default App;