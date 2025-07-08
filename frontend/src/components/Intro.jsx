import React, { useEffect, useRef, useState } from "react";
import "./Intro.css";

const AcercaDeModal = ({ onClose }) => {
  const ref = useRef();

  useEffect(() => {
    const first = ref.current?.querySelector("button");
    first?.focus();
  }, []);

  return (
    <div className="intro-modal-overlay">
      <div
        className="intro-modal acerca-de-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="acerca-titulo"
        ref={ref}
      >
        <h2 id="acerca-titulo">Acerca de esta aplicación</h2>
        <p>
          Esta aplicación fue desarrollada en el marco de la materia Diseño de Experiencia de Usuario de la Facultad de Informática de la UNLP.
          Su objetivo es asistir al grupo de investigación en Historia Medioambiental en la carga, visualización y gestión colaborativa de datos rurales, climáticos y geográficos, directamente desde el mapa.
        </p>
        <p>
          - Dante Gramblicka
        </p>
        <div className="intro-buttons">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

const IntroModal = ({ onClose, onLogin, onRegister }) => {
  const modalRef = useRef(null);
  const [showAcercaDe, setShowAcercaDe] = useState(false);

  useEffect(() => {
    const firstButton = modalRef.current?.querySelector("button");
    firstButton?.focus();
  }, []);

  return (
    <>
      <div className="intro-modal-overlay">
        <div
          className="intro-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-titulo"
          aria-describedby="intro-descripcion"
          ref={modalRef}
        >
          {/* Botón "Acerca de" arriba a la derecha */}
          <button
            className="acerca-de-button"
            onClick={() => setShowAcercaDe(true)}
            aria-label="Acerca de esta aplicación"
          >
            ℹ️
          </button>

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

      {showAcercaDe && <AcercaDeModal onClose={() => setShowAcercaDe(false)} />}
    </>
  );
};

export default IntroModal;
