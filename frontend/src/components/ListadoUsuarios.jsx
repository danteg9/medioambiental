import { useEffect, useState, useRef } from "react";
import "./ListadoUsuarios.css";

const ListadoUsuarios = ({ onClose }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/admin/`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar usuarios");
        return res.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const firstButton = modalRef.current?.querySelector("button");
    firstButton?.focus();
  }, [usuarios]);

  const toggleSuperuser = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/admin/${id}/toggle_superuser/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al cambiar permisos");

      const data = await res.json();
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_superuser: data.is_superuser } : u))
      );
    } catch (err) {
      alert("No se pudo cambiar el permiso.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Listado de usuarios</h2>

        {error ? (
          <p className="error">{error}</p>
        ) : usuarios.length === 0 ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Superusuario</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombres} {usuario.apellidos}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button onClick={() => toggleSuperuser(usuario.id)}>
                      {usuario.is_superuser ? "✔️" : "❌"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="botones">
          <button className="cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ListadoUsuarios;
