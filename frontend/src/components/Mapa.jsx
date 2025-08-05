import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import PuntoForm from "./PuntoForm";
import PuntoPopupWrapper from "./PuntoPopupWrapper";
import Menu from "./Menu";
import Configuracion from "./Configuracion";
import Intro from "./Intro";
import Login from "./Login";
import Registro from "./Register";
import Tutorial from "./Tutorial";
import "./Mapa.css";
import ListadoUsuarios from "./ListadoUsuarios";

const Mapa = () => {
    const mapRef = useRef(null);
    const [puntos, setPuntos] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
    const clickCoords = useRef(null);
    const [modoAgregar, setModoAgregar] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
    const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
    const toggleMenu = () => setMenuVisible((prev) => !prev);

    const API_URL = process.env.REACT_APP_API_URL;

    const [mostrarIntro, setMostrarIntro] = useState(() => {
        return !localStorage.getItem("sesion_iniciada");
    });

    const [sesionIniciada, setSesionIniciada] = useState(() => {
        return !!localStorage.getItem("sesion_iniciada");
    });

    const [mostrarTutorial, setMostrarTutorial] = useState(() => {
        const token = localStorage.getItem("access_token");
        const tutorialCompletado = localStorage.getItem("tutorial_completado");
        return token && !tutorialCompletado;
    });


    const pasosTutorial = [
        {
            selector: ".boton-menu",
            texto: "Este es el menú principal. Desde aca podés acceder a la configuración o cerrar sesión.",
        },
        {
            selector: ".boton-agregar",
            texto: "Este botón te permite agregar un nuevo punto al mapa. Al activarlo, tenes que hacer click sobre el mapa para agregar un punto.",
        },
        {
            selector: ".leaflet-control-zoom-in",
            texto: "Estos botones te permiten acercar o alejar el mapa.",
        }
    ];

    const [mapaInstancia, setMapaInstancia] = useState(null);
  
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const [nombreUsuario, setNombreUsuario] = useState("Usuario");
    const [isStaff, setIsStaff] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);

    


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
                setModoAgregar(false); // desactiva el modo agregar después del click
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

    const ObtenerInstanciaMapa = ({ onInstanciaLista }) => {
        const map = useMap();

        useEffect(() => {
            if (map) {
            onInstanciaLista(map);
            }
        }, [map]);

        return null;
    };


    const forzarAgregar = () => {
    if (modoAgregar) {
        if (!mapaInstancia) {
        console.log("mapaInstancia no está disponible aún");
        return;
        }
        const centro = mapaInstancia.getCenter();
        console.log("Centro del mapa:", centro);
        clickCoords.current = centro;
        setFormVisible(true);
        setModoAgregar(false);
    } else {
        setModoAgregar(true);
        setFormVisible(false);
        clickCoords.current = null;
    }
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
        if (!sesionIniciada) return;

        const fetchPuntos = async () => {
            try {
            const response = await fetchConTokenRenovable(`${API_URL}/api/puntos/listar/`);
            if (!response.ok) throw new Error("Error al obtener puntos");
            const data = await response.json();
            setPuntos(data);
            } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los puntos del servidor");
            }
        };

        fetchPuntos();
    }, [sesionIniciada]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const tutorialCompletado = localStorage.getItem("tutorial_completado");
        if (token && !tutorialCompletado) {
            setMostrarTutorial(true);
        } else {
            setMostrarTutorial(false);
        }
    }, [sesionIniciada]);

    useEffect(() => {
        if (!sesionIniciada) return;

        const fetchNombreUsuario = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
            const res = await fetch(`${API_URL}/api/usuario/`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al obtener nombre de usuario");

            const data = await res.json();

            if (data?.nombres) {
                setNombreUsuario(String(data.nombres));
            }
            if (data?.is_staff) {
                setIsStaff(data.is_staff);
            }
            if (data?.is_superuser) {
                setIsSuperuser(data.is_superuser);
            }
            } catch (err) {
            console.error("No se pudo obtener el usuario:", err);
            }
        };

        fetchNombreUsuario();
        }, [sesionIniciada]);



    const handleLogin = () => setMostrarLogin(true);
    const handleRegister = () => setMostrarRegistro(true);




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
            className={`boton-agregar ${modoAgregar ? "activo" : ""}`}
            onClick={forzarAgregar}
            title={modoAgregar ? "Crear punto en el centro del mapa" : "Agregar nuevo punto"}
            aria-label="Agregar nuevo punto"
            role="button"
        >
            +
        </button>

        {modoAgregar && (
        <button
            className="boton-agregar cancelar-agregar"
            onClick={() => {
            setModoAgregar(false);
            clickCoords.current = null;
            }}
            title="Cancelar agregar punto"
            aria-label="Cancelar agregar punto"
            role="button"
        >
            ✕
        </button>
        )}

        <MapContainer
            center={[-34.6, -58.4]}
            zoom={6}
            style={{ height: "100vh", width: "100vw" }}
            attributionControl={true}
            zoomControl={false}
            role="region"
            aria-label="Mapa interactivo con puntos ambientales"
        >
            <ObtenerInstanciaMapa onInstanciaLista={(mapa) => setMapaInstancia(mapa)} />
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

        {mostrarUsuarios && (
            <ListadoUsuarios onClose={() => setMostrarUsuarios(false)} />
        )}

        {puntoSeleccionado && (
            <PuntoPopupWrapper punto={puntoSeleccionado} onClose={() => setPuntoSeleccionado(null)} />
        )}
        {menuVisible && (
        <Menu
            nombreUsuario={nombreUsuario}
            isStaff={isStaff}
            onClose={() => setMenuVisible(false)}
            onAbrirConfiguracion={() => {
            setMenuVisible(false);
            setMostrarConfiguracion(true);
            }}
            onAbrirUsuarios={() => {
            setMenuVisible(false);
            setMostrarUsuarios(true);
            }}
            onCerrarSesion={handleCerrarSesion}
        />
        )}
        {mostrarIntro && (
        <Intro
            onLogin={handleLogin}
            onRegister={handleRegister}
        />
        )}
        {mostrarLogin && (
        <Login
            onClose={() => setMostrarLogin(false)}
            onSuccess={() => {
                setMostrarLogin(false);
                setMostrarIntro(false);
                setSesionIniciada(true);
            }}
        />
        )}

        {mostrarRegistro && (
        <Registro
            onClose={() => setMostrarRegistro(false)}
            onSuccess={() => {
                setMostrarRegistro(false);
                setMostrarIntro(false);
                setSesionIniciada(true);
            }}
        />
        )}

        {mostrarTutorial && (
        <Tutorial
            pasos={pasosTutorial}
            onFinish={() => {
            localStorage.setItem("tutorial_completado", "true");
            setMostrarTutorial(false);
            }}
        />
        )}


        </>
    );

    async function handleGuardarPunto(datos) {
        if (!clickCoords.current) return;

        setFormVisible(false);

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
                    formData.append("fotos", foto); // que se llame igual que en request.FILES.getlist()
                });
            } else {
                formData.append(key, puntoConCoords[key]);
            }
        }

        try {
            const response = await fetchConTokenRenovable(`${API_URL}/api/puntos/crear/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al guardar el punto");
            }

            // Esperar a que se cree y dsps traer todos los puntos
            const res = await fetchConTokenRenovable(`${API_URL}/api/puntos/listar/`);
            const data = await res.json();
            setPuntos(data);
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el punto");
        }
    }

    async function fetchConTokenRenovable(url, options = {}) {
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");

        const res = await fetch(url, {
            ...options,
            headers: {
            ...options.headers,
            Authorization: `Bearer ${access}`,
            },
        });

        if (res.status === 401 && refresh) {
            // Intentar refresh
            const refreshRes = await fetch(`${API_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
            });

            if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access);

            // Reintentar con el nuevo token
            return fetch(url, {
                ...options,
                headers: {
                ...options.headers,
                Authorization: `Bearer ${data.access}`,
                },
            });
            }
        }

        return res;
    }


    function handleCancelar() {
        setFormVisible(false);
        clickCoords.current = null;
    }

    function handleCerrarSesion() {
        setMostrarIntro(true);
        setMostrarConfiguracion(false);
        setMostrarUsuarios(false);
        setFormVisible(false);
        setPuntoSeleccionado(null);
        setMenuVisible(false);
        setSesionIniciada(false);
        setPuntos([]);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("sesion_iniciada");
    }


    
};

export default Mapa;
