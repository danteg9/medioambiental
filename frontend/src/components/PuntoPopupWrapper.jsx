import ReactDOM from "react-dom";
import PuntoPopup from "./PuntoPopup";

const PuntoPopupWrapper = ({ punto, onClose }) => {
  return ReactDOM.createPortal(
    <div className="punto-form-overlay" onClick={onClose}>
      <div className="punto-form" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          style={{ float: "right", marginBottom: "10px", cursor: "pointer" }}
        >
          ✖
        </button>
        <PuntoPopup punto={punto} onClose={onClose} />
      </div>
    </div>,
    document.body
  );
};

export default PuntoPopupWrapper;
