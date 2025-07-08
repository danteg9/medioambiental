import { useEffect, useRef, useState } from "react";
import "./Login.css";

const Registro = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        password: "",
        repetir_password: "",
    });

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [mostrarSalir, setMostrarSalir] = useState(false);

    const dialogRef = useRef(null);
    const confirmBtnRef = useRef(null);
    const salirBtnRef = useRef(null);

    useEffect(() => {
        const firstInput = dialogRef.current.querySelector("input");
        firstInput?.focus();
    }, []);

    useEffect(() => {
        if (mostrarConfirmacion && confirmBtnRef.current) {
            confirmBtnRef.current.focus();
        }
    }, [mostrarConfirmacion]);

    useEffect(() => {
        if (mostrarSalir && salirBtnRef.current) {
            salirBtnRef.current.focus();
        }
    }, [mostrarSalir]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const tieneDatos = () =>
        Object.values(form).some((campo) => campo.trim() !== "");

    const confirmarRegistro = (e) => {
        e.preventDefault();
        if (form.password !== form.repetir_password) {
            alert("Las contraseñas no coinciden");
            return;
        }
        setMostrarConfirmacion(true);
    };

    const confirmarCierre = () => {
        if (tieneDatos()) {
            setMostrarSalir(true);
        } else {
            onClose();
        }
    };

    const ejecutarRegistro = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/registro/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Registro fallido");

            const loginRes = await fetch(`${process.env.REACT_APP_API_URL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (!loginRes.ok) throw new Error("Login automático fallido");

            const loginData = await loginRes.json();
            localStorage.setItem("access_token", loginData.access);
            localStorage.setItem("refresh_token", loginData.refresh);
            localStorage.setItem("sesion_iniciada", "1");

            setMostrarConfirmacion(false);
            onSuccess();
        } catch (err) {
            alert("Error al registrarse.");
            setMostrarConfirmacion(false);
        }
    };

    return (
        <div className="modal-overlay">
            {/* Formulario principal */}
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="registro-titulo"
                aria-describedby="registro-descripcion"
                ref={dialogRef}
            >
                <h2 id="registro-titulo">Registro</h2>
                <p id="registro-descripcion" style={{ marginTop: "-8px", fontSize: "0.95rem" }}>
                    Complete el siguiente formulario para crear su cuenta
                </p>

                <form onSubmit={confirmarRegistro}>
                    <label htmlFor="input-nombres">Nombre/s</label>
                    <input
                        id="input-nombres"
                        name="nombres"
                        value={form.nombres}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="input-apellidos">Apellido/s</label>
                    <input
                        id="input-apellidos"
                        name="apellidos"
                        value={form.apellidos}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="input-email">Correo</label>
                    <input
                        id="input-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="input-password">Contraseña</label>
                    <input
                        id="input-password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="input-repetir-password">Repetir contraseña</label>
                    <input
                        id="input-repetir-password"
                        type="password"
                        name="repetir_password"
                        value={form.repetir_password}
                        onChange={handleChange}
                        required
                    />

                    <div className="botones">
                        <button type="submit">Registrarse</button>
                        <button type="button" onClick={confirmarCierre} className="cerrar">
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmación de registro */}
            {mostrarConfirmacion && (
                <div className="modal-confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-registro-titulo" aria-describedby="confirm-registro-desc">
                    <div className="modal">
                        <h3 id="confirm-registro-titulo">Confirmar registro</h3>
                        <p id="confirm-registro-desc">¿Confirmás que los datos ingresados son correctos?</p>
                        <div className="botones">
                            <button ref={confirmBtnRef} onClick={ejecutarRegistro}>
                                Sí, registrar
                            </button>
                            <button className="cerrar" onClick={() => setMostrarConfirmacion(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmación de cierre */}
            {mostrarSalir && (
                <div className="modal-confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-salir-titulo" aria-describedby="confirm-salir-desc">
                    <div className="modal">
                        <h3 id="confirm-salir-titulo">¿Cerrar registro?</h3>
                        <p id="confirm-salir-desc">¿Seguro que querés cerrar? Se perderán los datos ingresados.</p>
                        <div className="botones">
                            <button ref={salirBtnRef} onClick={onClose}>
                                Sí, cerrar
                            </button>
                            <button className="cerrar" onClick={() => setMostrarSalir(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Registro;
