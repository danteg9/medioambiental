import { useState, useEffect, useRef } from "react";
import "./PuntoForm.css";

const PuntoPopup = ({ punto, onClose }) => {
  const [seccionActiva, setSeccionActiva] = useState("geografica");
  const fotos = punto.fotos || [];
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL;

  const modalRef = useRef(null); // para atrapar foco
  const cerrarBtnRef = useRef(null); // foco inicial
  const ultimoActivoRef = useRef(null);
  const botonConfirmarRef = useRef(null);

  const [miMail, setMiMail] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);



  const secciones = [
    { clave: "geografica", etiqueta: "Geográfica" },
    { clave: "rural", etiqueta: "Rural" },
    { clave: "climatica", etiqueta: "Climática" },
  ];

  useEffect(() => {
    const fetchMiUsuario = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/api/usuarios/yo/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMiMail(data.email);
        }
      } catch (error) {
        console.error("Error al obtener mi usuario:", error);
      }
    };

    fetchMiUsuario();
  }, []);




  // Enfoque inicial y trampa de foco
  useEffect(() => {
    cerrarBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusArray = Array.from(focusables);
        const first = focusArray[0];
        const last = focusArray[focusArray.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!punto.mail) return;

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/api/usuarios/email/?email=${encodeURIComponent(punto.mail)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNombreUsuario(`${data.nombres} ${data.apellidos}`);
        } else {
          setNombreUsuario("Usuario desconocido");
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        setNombreUsuario("Usuario desconocido");
      }
    };
    fetchUsuario();
  }, [punto.mail]);

const borrarPunto = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/api/puntos/${punto.id}/eliminar/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      onClose();
    } else {
      const data = await response.json();
      alert(data.detail || "Error al borrar el punto.");
    }
  } catch (error) {
    console.error("Error al borrar punto:", error);
    alert("Error al borrar el punto.");
  }
};

  useEffect(() => {
    if (mostrarConfirmacion && botonConfirmarRef.current) {
      botonConfirmarRef.current.focus();
    }
  }, [mostrarConfirmacion]);


  return (
    <div className="punto-form-overlay">
      <div
        className="punto-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        ref={modalRef}
      >
        <h2 id="popup-title">{punto.nombre || "Información del punto"}</h2>

        {nombreUsuario && (
          <div className="punto-creado-por">
            Creado por: {nombreUsuario}
          </div>
        )}

        <div className="seccion-tabs" role="tablist" aria-label="Secciones del punto">
          {secciones.map(({ clave, etiqueta }) => (
            <button
              key={clave}
              type="button"
              role="tab"
              aria-selected={seccionActiva === clave}
              className={seccionActiva === clave ? "activo" : ""}
              onClick={() => setSeccionActiva(clave)}
            >
              {etiqueta}
            </button>
          ))}
        </div>

        <div className="seccion-content" role="tabpanel">
          {seccionActiva === "geografica" && (
            <>
              <label>
                Ubicación
              <div className="ubicacion-text">
                Lat: {punto.latitud?.toFixed(4)}, Lng: {punto.longitud?.toFixed(4)}
              </div>
              </label>

              <label>
                Fotos
                <div className="foto-grid">
                  {fotos.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className="foto-cuadro"
                      onClick={() => {
                        ultimoActivoRef.current = document.activeElement;
                        setFotoSeleccionada(f.imagen);
                        setFotoIndex(i);
                      }}
                      aria-label={`Ver foto ${i + 1}`}
                    >
                      <img
                        src={f.imagen}
                        alt={`Foto ${i + 1}`}
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              </label>


              <label>
                Fecha
                <div className="ubicacion-text">
                  {punto.fecha ? new Date(punto.fecha).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }) : "Fecha no disponible"}
                </div>
              </label>
            </>
          )}

          {seccionActiva === "rural" && (
            <>
              <label>
                Cultivos
                <div className="ubicacion-text">{punto.cultivos}</div>
              </label>
              <label>
                Cambios
                <div className="ubicacion-text">{punto.cambios}</div>
              </label>
            </>
          )}

          {seccionActiva === "climatica" && (
            <>
              <label>
                Temperatura
                <div className="ubicacion-text">{punto.temperatura}</div>
              </label>
              <label>
                Humedad
                <div className="ubicacion-text">{punto.humedad}</div>
              </label>
              <label>
                Viento
                <div className="ubicacion-text">{punto.viento}</div>
              </label>
            </>
          )}
        </div>

        <div className="form-buttons">
          {miMail === punto.mail && (
            <button type="button" className="borrar-btn" onClick={() => setMostrarConfirmacion(true)}>
              Borrar punto
            </button>
          )}
          <button type="button" onClick={onClose} ref={cerrarBtnRef}>
            Cerrar
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {fotoSeleccionada && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Vista de imagen"
          onClick={() => setFotoSeleccionada(null)}
        >
          <div
            className="lightbox-wrapper"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setFotoSeleccionada(null);
              } else if (e.key === "Tab") {
                // Atrapar el foco con Tab/Shift+Tab
                const focusables = e.currentTarget.querySelectorAll(
                  'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey) {
                  if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  }
                } else {
                  if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              }
            }}
          >
            <div className="lightbox-content">
              <img src={fotoSeleccionada} alt="Imagen ampliada" />
            </div>

            {fotos.length > 1 && (
              <>
                <button
                  className="lightbox-btn izquierda"
                  aria-label="Foto anterior"
                  onClick={() => {
                    const nuevoIndex = (fotoIndex - 1 + fotos.length) % fotos.length;
                    setFotoIndex(nuevoIndex);
                    setFotoSeleccionada(fotos[nuevoIndex].imagen);
                  }}
                >
                  ◀
                </button>
                <button
                  className="lightbox-btn derecha"
                  aria-label="Foto siguiente"
                  onClick={() => {
                    const nuevoIndex = (fotoIndex + 1) % fotos.length;
                    setFotoIndex(nuevoIndex);
                    setFotoSeleccionada(fotos[nuevoIndex].imagen);
                  }}
                >
                  ▶
                </button>
              </>
            )}
            <button
              className="lightbox-cerrar"
              aria-label="Cerrar imagen ampliada"
              onClick={() => {
                setFotoSeleccionada(null);
                // Restaurar foco tras cerrar
                setTimeout(() => {
                  ultimoActivoRef.current?.focus();
                }, 0);
              }}
              autoFocus
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {mostrarConfirmacion && (
        <div
          className="modal-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          aria-describedby="confirm-delete-desc"
        >
          <div className="modal">
            <h3 id="confirm-delete-title">¿Borrar punto?</h3>
            <p id="confirm-delete-desc">¿Estás seguro de que querés borrar este punto?</p>
            <div className="botones">
              <button ref={botonConfirmarRef} onClick={borrarPunto}>Sí, borrar</button>
              <button className="cerrar" onClick={() => setMostrarConfirmacion(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PuntoPopup;
