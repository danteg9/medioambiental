import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import PuntoForm from "./PuntoForm";
import PuntoPopupWrapper from "./PuntoPopupWrapper";
import Menu from "./Menu";
import Configuracion from "./Configuracion";
import "./Mapa.css";

const Mapa = () => {
    const [puntos, setPuntos] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
    const clickCoords = useRef(null);
    const [modoAgregar, setModoAgregar] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
    const toggleMenu = () => setMenuVisible((prev) => !prev);

    const API_URL = process.env.REACT_APP_API_URL;

    const AgregarMarcador = () => {
        const map = useMap();
        const handlerRef = useRef(null);

        useEffect(() => {
            if (handlerRef.current) {
                map.off("click", handlerRef.current);
            }

            const handler = (e) => {
                if (!modoAgregar) return; // solo si el modo agregar está activo
                clickCoords.current = e.latlng;
                setFormVisible(true);
                setModoAgregar(false); // desactiva el modo agregar después del clic
            };

            map.on("click", handler);
            handlerRef.current = handler;

            return () => {
                map.off("click", handler);
            };
        }, [map, modoAgregar]);

        return null;
    };


    const CustomAttribution = () => {
        const map = useMap();

        useEffect(() => {
            const control = map.attributionControl;
            if (!control) return;
            control.setPrefix('<a href="https://leafletjs.com/" target="_blank">Leaflet</a>');

            control._container.innerHTML = "";
            control.addAttribution(`
            <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> +
            <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>
            `);
        }, [map]);

        return null;
    };

    const CustomZoomControl = () => {
        const map = useMap();

        useEffect(() => {
            const zoomControl = L.control.zoom({ position: "bottomright" });
            zoomControl.addTo(map);

            // Cambiar títulos de los botones
            const container = zoomControl.getContainer();
            if (container) {
                const buttons = container.querySelectorAll('a.leaflet-control-zoom-in, a.leaflet-control-zoom-out');
                buttons.forEach(btn => {
                    if (btn.classList.contains('leaflet-control-zoom-in')) {
                        btn.title = 'Acercar mapa';
                    } else if (btn.classList.contains('leaflet-control-zoom-out')) {
                        btn.title = 'Alejar mapa';
                    }
                });
            }

            return () => {
            map.removeControl(zoomControl);
            };
        }, [map]);

        return null;
    };


    const forzarAgregar = () => {
        setModoAgregar(true);
        setFormVisible(false);
        clickCoords.current = null;
    };

    useEffect(() => {
        const mapContainer = document.querySelector('.leaflet-container');
        if (!mapContainer) return;

        if (modoAgregar) {
            mapContainer.style.cursor = 'url("/img/cursor.png") 32 32, auto';
        } else {
            mapContainer.style.cursor = '';
        }

        return () => {
            if (mapContainer) {
                mapContainer.style.cursor = '';
            }
        };
    }, [modoAgregar]);

    useEffect(() => {
        const fetchPuntos = async () => {
            try {
                const response = await fetch(`${API_URL}/api/puntos/listar/`);
                if (!response.ok) throw new Error("Error al obtener puntos");

                const data = await response.json();
                setPuntos(data);
            } catch (error) {
                console.error(error);
                alert("No se pudieron cargar los puntos del servidor");
            }
        };

        fetchPuntos();
    }, []);



    return (
        <>
        <button
        className={`boton-menu ${menuVisible ? "cerrar" : ""}`}
        onClick={toggleMenu}
        title={menuVisible ? "Cerrar menú" : "Abrir menú"}
        aria-label={menuVisible ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={menuVisible}
        aria-controls="menu-principal"
        >
        {menuVisible ? "✕" : "☰"}
        </button>

        <button
            className="boton-agregar"
            onClick={forzarAgregar}
            title="Agregar nuevo punto"
            aria-label="Agregar nuevo punto"
            role="button"
            >
            +
        </button>
        <MapContainer
            center={[-34.6, -58.4]}
            zoom={6}
            style={{ height: "100vh", width: "100vw" }}
            attributionControl={true}
            zoomControl={false}
            role="region"
            aria-label="Mapa interactivo con puntos ambientales"
        >
            <TileLayer
            url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
            minZoom={3}
            maxZoom={18}
            />

            <CustomZoomControl />
            <CustomAttribution />
            <AgregarMarcador />

            {puntos.map((punto, idx) => (
            <Marker
                key={idx}
                position={[punto.latitud, punto.longitud]}
                eventHandlers={{
                    click: () => {
                    setPuntoSeleccionado(punto);
                    },
                    keydown: (e) => {
                    if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ") {
                        e.originalEvent.preventDefault();
                        setPuntoSeleccionado(punto);
                    }
                    },
                }}
            />

            ))}
        </MapContainer>

        {formVisible && (
            <PuntoForm
                onClose={handleCancelar}
                onSave={handleGuardarPunto}
                coords={clickCoords.current}
            />
        )}

        {mostrarConfiguracion && (
            <Configuracion onClose={() => setMostrarConfiguracion(false)} />
        )}


        {puntoSeleccionado && (
            <PuntoPopupWrapper punto={puntoSeleccionado} onClose={() => setPuntoSeleccionado(null)} />
        )}
        {menuVisible && (
            <Menu
                onClose={() => setMenuVisible(false)}
                onAbrirConfiguracion={() => {
                setMenuVisible(false);            // Cierra el menú
                setMostrarConfiguracion(true);    // Abre la vista de configuración
                }}
            />
        )}
        </>
    );

    async function handleGuardarPunto(datos) {
        if (!clickCoords.current) return;

        // ✅ Cerramos primero el formulario
        setFormVisible(false);

        // ✅ Guardamos una copia local de las coordenadas antes de borrarlas
        const coords = { ...clickCoords.current };
        clickCoords.current = null;

        const puntoConCoords = {
            ...datos,
            latitud: coords.lat,
            longitud: coords.lng,
        };

        const formData = new FormData();

        for (const key in puntoConCoords) {
            if (key === "fotos") {
                puntoConCoords.fotos.forEach((foto) => {
                    formData.append("fotos", foto); // Es importante que se llame igual que en request.FILES.getlist()
                });
            } else {
                formData.append(key, puntoConCoords[key]);
            }
        }

        try {
            const response = await fetch(`${API_URL}/api/puntos/crear/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al guardar el punto");
            }

            // Esperar a que se cree exitosamente, y luego traer todos los puntos
            const res = await fetch(`${API_URL}/api/puntos/listar/`);
            const data = await res.json();
            setPuntos(data); // ✅ Aquí están todos los puntos con las fotos correctas
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el punto");
        }
    }


    function handleCancelar() {
        setFormVisible(false);
        clickCoords.current = null;
    }
    
};

export default Mapa;
