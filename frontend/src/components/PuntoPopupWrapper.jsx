import ReactDOM from "react-dom";
import PuntoPopup from "./PuntoPopup";

const PuntoPopupWrapper = ({ punto, onClose, recargarPuntos }) => {
  const handleClose = () => {
    if (typeof recargarPuntos === "function") {
      recargarPuntos();
    }
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="punto-form-overlay" onClick={handleClose}>
      <div className="punto-form" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleClose}
          style={{ float: "right", marginBottom: "10px", cursor: "pointer" }}
        >
          ✖
        </button>
        <PuntoPopup punto={punto} onClose={handleClose} />
      </div>
    </div>,
    document.body
  );
};

export default PuntoPopupWrapper;
