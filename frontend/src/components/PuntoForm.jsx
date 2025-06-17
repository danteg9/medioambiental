import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useEffect, useState, useRef } from "react";
import "./PuntoForm.css";
import { useIdioma } from '../context/idioma';
import Notificacion from "./Notificacion";


const PuntoForm = ({ onClose, onSave, coords }) => {
    const [seccionActiva, setSeccionActiva] = useState("geografica");

    const [nombre, setNombre] = useState("");
    const [nombreInvalido, setNombreInvalido] = useState(false);

    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [cultivos, setCultivos] = useState("");
    const [cambios, setCambios] = useState("");
    const [temperatura, setTemperatura] = useState({ valor: "", unidad: "°C" });
    const [viento, setViento] = useState({ valor: "", unidad: "km/h" });
    const [humedad, setHumedad] = useState("");

    const [fotos, setFotos] = useState([]);
    const [fecha, setFecha] = useState(new Date());

    const [notificacion, setNotificacion] = useState(null);

    const [confirmacion, setConfirmacion] = useState(null);
    


    const secciones = [
      { clave: "geografica", etiqueta: "Geográfica" },
      { clave: "rural", etiqueta: "Rural" },
      { clave: "climatica", etiqueta: "Climática" },
    ];


    // 🕓 Setear fecha actual al abrir el formulario
    useEffect(() => {
        const ahora = new Date();
        setFecha(ahora);
    }, []);
    // Esto se debería setear desde el padre con las coordenadas reales
    const [ubicacion, setUbicacion] = useState("");

    const { localeDateFns, localeMui } = useIdioma();


    useEffect(() => {
        if (coords) {
        const { lat, lng } = coords;
        setUbicacion(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        }
    }, [coords]);

    const handleFotoChange = (e) => {
        const files = Array.from(e.target.files);

        const nuevasFotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setFotos((prev) => [...prev, ...nuevasFotos]);
    };

    const handleEliminarFoto = (index) => {
        const nuevasFotos = [...fotos];
        // Liberar memoria del object URL
        URL.revokeObjectURL(nuevasFotos[index].preview);
        nuevasFotos.splice(index, 1);
        setFotos(nuevasFotos);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (seccionActiva !== "climatica") return;

      if (!nombre.trim()) {
        setNombreInvalido(true);
        setNotificacion({ mensaje: "El nombre del punto es obligatorio", tipo: "error" });
        return;
      }

      setNombreInvalido(false);

      // Construcción de campos finales como strings
      const temperaturaFormateada = temperatura.valor
        ? `${temperatura.valor}${temperatura.unidad}`
        : "";
      const humedadFormateada = humedad ? `${humedad}%` : "";
      const vientoFormateado = viento.valor
        ? `${viento.valor} ${viento.unidad}`
        : "";

      setConfirmacion({
        tipo: "guardar",
        datos: {
          nombre,
          descripcion,
          tipo,
          ubicacion,
          fecha: fecha.toISOString(),
          fotos: fotos.map(f => f.file),
          cultivos,
          cambios,
          temperatura: temperaturaFormateada,
          humedad: humedadFormateada,
          viento: vientoFormateado,
        },
      });
    };


    const formRef = useRef(null);

    const ref = useRef(null);
      useEffect(() => {
        // Solo actualizamos el texto si NO está editando
        if (ref.current && document.activeElement !== ref.current) {
          ref.current.innerText = nombre;
        }
    }, [nombre]);

    useEffect(() => {
      // Atrapar tab
      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const form = formRef.current;
      const focusables = form?.querySelectorAll(focusableSelectors);
      const first = focusables?.[0];
      const last = focusables?.[focusables.length - 1];

      const trap = (e) => {
        if (e.key !== 'Tab') return;
        if (!focusables.length) return;

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
      };

      form?.addEventListener('keydown', trap);
      return () => form?.removeEventListener('keydown', trap);
    }, []);

    useEffect(() => {
      // Enfocar primer campo de la nueva sección
      const panel = document.getElementById(`panel-${seccionActiva}`);
      const input = panel?.querySelector('input, [contenteditable="true"], textarea, select, button');
      if (input) input.focus();
    }, [seccionActiva]);


    // Log cuando cambia la sección activa
    useEffect(() => {
    }, [seccionActiva]);

    const confirmRef = useRef(null);

    useEffect(() => {
      if (!confirmacion) return;

      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modal = confirmRef.current;
      const focusables = modal?.querySelectorAll(focusableSelectors);
      const first = focusables?.[0];
      const last = focusables?.[focusables.length - 1];

      const trap = (e) => {
        if (e.key !== 'Tab') return;
        if (!focusables.length) return;

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
      };

      modal?.addEventListener('keydown', trap);
      first?.focus(); // Enfocar el primer botón

      return () => modal?.removeEventListener('keydown', trap);
    }, [confirmacion]);


    useEffect(() => {
      // Enfocar el título solo si no hay una confirmación activa
      if (!confirmacion && ref.current) {
        ref.current.focus();
      }
    }, [confirmacion]);

    return (
      <div className="punto-form-overlay">
        {confirmacion && (
          <div className="punto-form-overlay confirmacion-overlay">
            <div
              className="confirmacion-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirmacion-titulo"
              ref={confirmRef}
            >
              <h3 id="confirmacion-titulo">
                {confirmacion.tipo === "guardar"
                  ? "¿Guardar punto?"
                  : "¿Cancelar y descartar este punto?"}
              </h3>
              <p>
                {confirmacion.tipo === "guardar"
                  ? "¿Estás seguro de que querés guardar este punto?"
                  : "Si cancelás, se perderá el punto que estás creando. ¿Estás seguro?"}
              </p>

              <div className="form-buttons">
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                  <button
                    type="button"
                    onClick={() => setConfirmacion(null)}
                  >
                    Volver
                  </button>
                </div>

                <div>
                  <button
                    className="primary-button"
                    autoFocus
                    onClick={() => {
                      if (confirmacion.tipo === "guardar") {
                        onSave(confirmacion.datos);
                      } else if (confirmacion.tipo === "cancelar") {
                        onClose();
                      }
                      setConfirmacion(null);
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      <form
        className="punto-form"
        aria-labelledby="form-titulo"
        onKeyDown={(e) => {
          const tag = e.target.tagName;
          const type = e.target.type;
          if (e.key === "Enter" && tag !== "TEXTAREA" && type !== "submit" && tag !== "BUTTON") {
            e.preventDefault();
          }
        }}
        ref={formRef}
      >
        {/* TÍTULO EDITABLE */}
        <div
          ref={ref}
          id="form-titulo"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Nombre del punto"
          aria-required="true"
          aria-invalid={nombreInvalido ? "true" : "false"}
          aria-describedby={nombreInvalido ? "nombre-error" : undefined}
          className={`nombre-editable ${!nombre ? "placeholder" : ""} ${nombreInvalido ? "invalido" : ""}`}
          tabIndex={0}
          onInput={(e) => {
            const texto = e.currentTarget.innerText;
            setNombre(texto);
            if (nombreInvalido && texto.trim()) {
              setNombreInvalido(false); // Se resetea al volver a escribir
            }
          }}
          onBlur={(e) => {
            const texto = e.currentTarget.innerText.trim();
            setNombre(texto);
          }}
          style={{ direction: "ltr", textAlign: "center" }}
        />

        {/* SECCIONES */}
        <nav role="tablist" aria-label="Secciones del formulario" className="seccion-tabs">
          {secciones.map(({ clave, etiqueta }) => (
            <button
              key={clave}
              type="button"
              className={seccionActiva === clave ? "activo" : ""}
              role="tab"
              aria-selected={seccionActiva === clave}
              aria-controls={`panel-${clave}`}
              id={`tab-${clave}`}
              tabIndex={seccionActiva === clave ? 0 : -1}
              onClick={() => setSeccionActiva(clave)}
            >
              {etiqueta}
            </button>
          ))}
        </nav>

        {/* CONTENIDO DE CADA SECCIÓN */}
        {seccionActiva === "geografica" && (
          <div
            className="seccion-content"
            role="tabpanel"
            id="panel-geografica"
            aria-labelledby="tab-geografica"
          >
            <div className="form-section">
              <label htmlFor="ubicacion">Ubicación</label>
              <div id="ubicacion" className="ubicacion-text">{ubicacion}</div>
            </div>

            {/* Fotos */}
            <div className="form-section">
              <div className="form-section-title">Fotos</div>
              <div className="foto-grid">
                {fotos.map((f, i) => (
                  <div className="foto-cuadro" key={i}>
                    <img src={f.preview} alt={`Foto ${i + 1}`} draggable={false} />
                    <button
                      type="button"
                      className="foto-eliminar"
                      aria-label={`Eliminar foto ${i + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEliminarFoto(i);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="foto-input"
                  className="foto-cuadro foto-agregar"
                  aria-label="Agregar fotos"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("foto-input")?.click(); // dispara el input
                    }
                  }}
                >
                  +
                </label>
                <input
                  id="foto-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFotoChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="fecha">Fecha</label>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={localeDateFns}
                localeText={localeMui}
              >
                <DateTimePicker
                  value={fecha}
                  onChange={setFecha}
                  ampm={false}
                  slotProps={{
                    textField: {
                      id: "fecha",
                      fullWidth: true,
                      variant: 'outlined',
                      size: 'small',
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        )}

        {seccionActiva === "rural" && (
          <div
            className="seccion-content"
            role="tabpanel"
            id="panel-rural"
            aria-labelledby="tab-rural"
          >
            <label htmlFor="cultivos">Cultivos</label>
            <textarea
              id="cultivos"
              value={cultivos}
              onChange={(e) => {
                const texto = e.target.value.slice(0, 255);
                setCultivos(texto);
              }}
              rows={1}
              style={{ maxHeight: "4.5em", resize: "none", overflowY: "auto" }}
              aria-describedby="cultivos-ayuda"
            ></textarea>
            <small id="cultivos-ayuda">Máximo 255 caracteres</small>

            <label htmlFor="cambios">Cambios</label>
            <textarea
              id="cambios"
              value={cambios}
              onChange={(e) => {
                const texto = e.target.value.slice(0, 255);
                setCambios(texto);
              }}
              rows={1}
              style={{ maxHeight: "4.5em", resize: "none", overflowY: "auto" }}
              aria-describedby="cambios-ayuda"
            ></textarea>
            <small id="cambios-ayuda">Máximo 255 caracteres</small>

          </div>
        )}

        {seccionActiva === "climatica" && (
          <div
            className="seccion-content"
            role="tabpanel"
            id="panel-climatica"
            aria-labelledby="tab-climatica"
          >
            <label htmlFor="temperatura">Temperatura</label>
            <div className="input-unidad">
              <input
                id="temperatura"
                type="text"
                inputMode="numeric"
                pattern="\d{0,3}"
                maxLength={3}
                value={temperatura.valor}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                  setTemperatura({ ...temperatura, valor: val });
                }}
                placeholder="Ej: 19"
              />
              <select
                value={temperatura.unidad}
                onChange={(e) => setTemperatura({ ...temperatura, unidad: e.target.value })}
                aria-label="Unidad de temperatura"
              >
                <option value="°C">°C</option>
                <option value="°F">°F</option>
              </select>
            </div>

            <label htmlFor="humedad">Humedad</label>
            <div className="input-unidad">
              <input
                id="humedad"
                type="text"
                inputMode="numeric"
                pattern="\d{0,3}"
                maxLength={3}
                value={humedad}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                  setHumedad(val);
                }}
                placeholder="Ej: 60"
              />
              <span className="sufijo">%</span>
            </div>

            <label htmlFor="viento">Viento</label>
            <div className="input-unidad">
              <input
                id="viento"
                type="text"
                maxLength={10}
                value={viento.valor}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 10);
                  setViento({ ...viento, valor: val });
                }}
                placeholder="Ej: 23-31"
              />
              <select
                value={viento.unidad}
                onChange={(e) => setViento({ ...viento, unidad: e.target.value })}
                aria-label="Unidad de viento"
              >
                <option value="km/h">km/h</option>
                <option value="m/s">m/s</option>
              </select>
            </div>

          </div>
        )}

        {/* BOTONES DE NAVEGACIÓN */}
        <div className="form-buttons">
          <div style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => setConfirmacion({ tipo: "cancelar" })}
              aria-label="Cancelar creación del punto"
            >
              Cancelar
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.5em" }}>
            {seccionActiva !== "geografica" && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  if (seccionActiva === "rural") setSeccionActiva("geografica");
                  else if (seccionActiva === "climatica") setSeccionActiva("rural");
                }}
              >
                Atrás
              </button>
            )}

            {seccionActiva !== "climatica" ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  if (seccionActiva === "geografica") setSeccionActiva("rural");
                  else if (seccionActiva === "rural") setSeccionActiva("climatica");
                }}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={handleSubmit}
              >
                Guardar
              </button>
            )}
          </div>
        </div>
      </form>
          {notificacion && (
      <Notificacion
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onClose={() => setNotificacion(null)}
      />
    )}
    </div>
  );
};

export default PuntoForm;
