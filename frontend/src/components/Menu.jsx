import { useEffect, useRef, useState } from "react";
import "./Menu.css";

const Menu = ({ nombreUsuario, isStaff, onAbrirConfiguracion, onCerrarSesion, onAbrirUsuarios }) => {
  const menuRef = useRef(null);
  const confirmarBtnRef = useRef(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const firstFocusable = menuRef.current.querySelector("button, [tabindex='0']");
    firstFocusable?.focus();
  }, []);

  useEffect(() => {
    if (mostrarConfirmacion && confirmarBtnRef.current) {
      confirmarBtnRef.current.focus();
    }
  }, [mostrarConfirmacion]);

  const ejecutarCerrarSesion = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("sesion_iniciada");
    onCerrarSesion();
  };

  return (
    <>
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
        <h2 style={{ marginTop: 0 }}>Hola {nombreUsuario}</h2>

        <button
          className="boton-principal"
          onClick={onAbrirConfiguracion}
          aria-label="Ir a configuración"
        >
          Configuración
        </button>

        {isStaff && (
          <button
            className="boton-principal"
            onClick={onAbrirUsuarios}
            aria-label="Administrar usuarios"
            style={{ marginTop: "10px" }}
          >
            Usuarios
          </button>
        )}

        <button
          className="boton-principal cerrar-sesion"
          onClick={() => setMostrarConfirmacion(true)}
          aria-label="Cerrar sesión"
          style={{ marginTop: "10px" }}
        >
          Cerrar sesión
        </button>
      </div>

      {mostrarConfirmacion && (
        <div
          className="modal-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-logout-title"
          aria-describedby="confirm-logout-desc"
        >
          <div className="modal">
            <h3 id="confirm-logout-title">¿Cerrar sesión?</h3>
            <p id="confirm-logout-desc">¿Estás seguro de que querés cerrar sesión?</p>
            <div className="botones">
              <button ref={confirmarBtnRef} onClick={ejecutarCerrarSesion}>
                Sí, cerrar sesión
              </button>
              <button className="cerrar" onClick={() => setMostrarConfirmacion(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default Menu;
