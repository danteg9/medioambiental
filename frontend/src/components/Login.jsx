import { useEffect, useRef, useState } from "react";
import "./Login.css";

const Login = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dialogRef = useRef(null);

    useEffect(() => {
        // Enfocar el primer campo al abrir
        const firstInput = dialogRef.current.querySelector("input");
        firstInput?.focus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Login fallido");

            const data = await res.json();

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("sesion_iniciada", "1");

            onSuccess();
        } catch (err) {
            alert("Credenciales incorrectas.");
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-titulo"
                aria-describedby="login-descripcion"
                ref={dialogRef}
            >
                <h2 id="login-titulo">Iniciar Sesión</h2>
                <p id="login-descripcion" style={{ marginTop: "-8px", fontSize: "0.95rem" }}>
                    Ingrese sus credenciales para continuar
                </p>

                <form onSubmit={handleLogin}>
                    <label htmlFor="login-email">Correo electrónico</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="botones">
                        <button type="submit">Entrar</button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cerrar"
                        >
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
