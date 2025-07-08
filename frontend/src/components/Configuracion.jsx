import { useEffect, useRef, useState } from "react";
import "./Configuracion.css";

const Configuracion = ({ onClose }) => {
  const popupRef = useRef();
  const [tamanio, setTamanio] = useState("mediana");

  useEffect(() => {
    const saved = localStorage.getItem("tamanioFuente");
    if (saved === "chica" || saved === "mediana" || saved === "grande") {
      setTamanio(saved);
    }

    const firstFocusable = popupRef.current.querySelector("input, button");
    firstFocusable?.focus();
  }, []);

  const guardarTamanio = (valor) => {
    localStorage.setItem("tamanioFuente", valor);
    document.body.classList.remove("fuente-chica", "fuente-mediana", "fuente-grande");
    document.body.classList.add(`fuente-${valor}`);
    setTamanio(valor); // actualizar el estado
  };

  return (
    <div
      className="popup"
      role="dialog"
      aria-modal="true"
      aria-label="Configuración"
      ref={popupRef}
    >
      <h2>Configuración</h2>

      <fieldset>
        <legend>Tamaño de fuente</legend>
        <label>
          <input
            type="radio"
            name="fuente"
            value="chica"
            checked={tamanio === "chica"}
            onChange={(e) => guardarTamanio(e.target.value)}
          />
          Chica
        </label>
        <label>
          <input
            type="radio"
            name="fuente"
            value="mediana"
            checked={tamanio === "mediana"}
            onChange={(e) => guardarTamanio(e.target.value)}
          />
          Mediana
        </label>
        <label>
          <input
            type="radio"
            name="fuente"
            value="grande"
            checked={tamanio === "grande"}
            onChange={(e) => guardarTamanio(e.target.value)}
          />
          Grande
        </label>
      </fieldset>

      <div className="form-buttons">
        <button type="button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Configuracion;
