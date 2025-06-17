import { useEffect, useRef } from "react";
import "./Menu.css";

const Menu = ({ onAbrirConfiguracion }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const firstFocusable = menuRef.current.querySelector("button, [tabindex='0']");
    firstFocusable?.focus();
  }, []);

  return (
    <div
      id="menu-principal"
      className="menu-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
      ref={menuRef}
      style={{ top: "35px", left: "20px" }}
    >
      <div style={{ height: "20px" }} />
      <h2 style={{ marginTop: 0 }}>Hola Usuario</h2>
      <button
        className="boton-principal"
        onClick={onAbrirConfiguracion}
        aria-label="Ir a configuración"
      >
        Configuración
      </button>
    </div>
  );
};

export default Menu;

