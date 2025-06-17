import { useEffect } from "react";
import "./Notificacion.css";

const Notificacion = ({ mensaje, tipo = "info", onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 8000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`notificacion ${tipo}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {mensaje}
    </div>
  );
};

export default Notificacion;
