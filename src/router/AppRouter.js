import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bienvenido } from "../components/Bienvenida";
import { Finalizado } from "../components/Finalizado";
import { userContext } from '../hooks/useContext';
import VideoLlamada from "../components/VideoLlamada";
import { Datos } from "../components/Datos";

export const AppRouter = () => {
  const { usuario, setUsuario, setDatos } = useContext(userContext);

  useEffect(() => {
    if (localStorage.getItem("usuario")) {
      setUsuario(localStorage.getItem("usuario"));
    } else if (usuario) {
      localStorage.removeItem("usuario");
    }
  }, [usuario, setUsuario]);

  return (
    <Router basename='/videopar'>
      <div>
        <Routes>
          <Route exact path="/" element={<Bienvenido/>} />
          {usuario && <Route path="/session/:id" element={<VideoLlamada/>} />}
          {!usuario && <Route path="/session/:id" element={<Datos setDatos={setDatos} tipo={2}/>} />}
          <Route path="/fin" element={<Finalizado/>} />
          <Route path="*" element={<Bienvenido />} />
        </Routes>
      </div>
    </Router>
  );
};