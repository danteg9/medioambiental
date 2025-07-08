import React, { useEffect, useRef } from "react";
import "./Intro.css";

const IntroModal = ({ onClose, onLogin, onRegister }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const firstButton = modalRef.current.querySelector("button");
    firstButton?.focus();
  }, []);

  return (
    <div className="intro-modal-overlay">
      <div
        className="intro-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-titulo"
        aria-describedby="intro-descripcion"
        ref={modalRef}
      >
        <h2 id="intro-titulo">Bienvenido</h2>
        <p id="intro-descripcion">
          Esta aplicación permite al grupo de investigación de Historia Medioambiental
          cargar, visualizar y colaborar con información geográfica, climática y rural,
          directamente desde el mapa.
        </p>
        <div className="intro-buttons">
          <button onClick={onLogin}>Iniciar sesión</button>
          <button onClick={onRegister}>Registrarse</button>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;
