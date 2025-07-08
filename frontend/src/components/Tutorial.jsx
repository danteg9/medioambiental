import { useEffect, useRef, useState } from "react";
import "./Tutorial.css";

const Tutorial = ({ pasos, onFinish }) => {
  const [pasoActual, setPasoActual] = useState(0);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const selector = pasos[pasoActual]?.selector;
    const el = document.querySelector(selector);

    if (el) {
      const rect = el.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - (rect.bottom + 10);
      const tooltipAlturaEstimada = 120;
      const mostrarArriba = espacioAbajo < tooltipAlturaEstimada;

      const espacioDerecha = window.innerWidth - (rect.left + 300); // max-width
      const ajustarIzquierda = espacioDerecha < 0 ? Math.abs(espacioDerecha) + 10 : 0;

      setPosicion({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        mostrarArriba,
        ajustarIzquierda,
      });
    }
  }, [pasoActual, pasos]);

  useEffect(() => {
    // Mover foco al tooltip al mostrarse
    tooltipRef.current?.focus();
  }, [posicion]);

  const siguiente = () => {
    if (pasoActual + 1 < pasos.length) {
      setPasoActual(pasoActual + 1);
    } else {
      onFinish();
    }
  };

  if (!pasos[pasoActual]) return null;

  const tooltipTop = posicion.mostrarArriba
    ? posicion.top - 200
    : posicion.top + posicion.height + 10;

  const tooltipLeft = posicion.left - (posicion.ajustarIzquierda || 0);

  const pasoId = `tutorial-paso-${pasoActual}`;
  const textoId = `tutorial-texto-${pasoActual}`;

  return (
    <>
      <div className="tutorial-overlay" aria-hidden="true" />
      <div
        className="tutorial-highlight"
        style={{
          top: posicion.top,
          left: posicion.left,
          width: posicion.width,
          height: posicion.height,
        }}
        aria-hidden="true"
      />
        <div
            className="tutorial-tooltip modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={pasoId}
            aria-describedby={textoId}
            style={{ top: tooltipTop, left: tooltipLeft }}
            tabIndex="-1"
            ref={tooltipRef}
        >
            <h2 id={pasoId} className="sr-only">Instrucción del tutorial</h2>
            <p id={textoId} aria-live="polite">
            {pasos[pasoActual].texto}
            </p>
            <div className="botones">
            <button
                onClick={siguiente}
                className={pasoActual + 1 < pasos.length ? "" : "cerrar"}
            >
                {pasoActual + 1 < pasos.length ? "Siguiente" : "Entendido"}
            </button>
            </div>
      </div>
    </>
  );
};

export default Tutorial;
