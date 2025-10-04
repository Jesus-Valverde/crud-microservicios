import React, { useEffect, useState } from "react";
// Componentes MUI
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, Box, Chip, Typography, Snackbar, Alert
} from "@mui/material";
// Iconos MUI
import BorderColorIcon from '@mui/icons-material/BorderColor';

export default function UsuariosCrud() {
  // Información recolectada de base de datos
  const [usuarios, setUsuarios] = useState([]);

  // Modal dinámico para interacciones con usuario
  const [modalActivo, setModalActivo] = useState(null);
  // Usuario seleccionado de la tabla
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  // Datos para el formulario
  const [formData, setFormData] = useState(null);

  // Manejo de mensajes modal
  const [mensaje, setMensaje] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("error");

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Aquí se guarda el tipo de modal a enseñar, el usuario a modificar y se genera los campos del formualario dependiendo de la operación
  const handleOpenModalDinamico = (tipo, usuario) => {
    setModalActivo(tipo);
    setUsuarioSeleccionado(usuario);
    if (tipo === "agregar") {
      setFormData({
        nombre: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
      });
    }
    else if (tipo === "editar" && usuario) {
      setFormData({
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        contrasena: "",
        confirmarContrasena: "",
      });
    }
    else if (tipo === "cambiarEstado" && usuario) {
      setFormData({
        id: usuario.id_usuario,
        nuevoEstado: usuario.estado === 1 ? 0 : 1,
      });
    }
    else {
      setFormData(null);
    }
  };

  // Manda la petición al back para cambiar el estado
  const handleSubmitEstado = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró token en el localStorage");
        return;
      }
      
      const res = await fetch("http://localhost:5000/api/cambiarEstadoUsuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: usuarioSeleccionado.id_usuario,
          estado: usuarioSeleccionado.estado === 1 ? 0 : 1
        })
      });
      const data = await res.json();

      if (data.success) {
        fetchUsuarios();
        setModalActivo(null);
        setSeverity("success");
        setMensaje("Cambio de estado exitoso");
        setOpenSnackbar(true);
      } else {
        setSeverity("error");
        setMensaje(data.message || "Error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setSeverity("error");
      setMensaje("Error de conexión con el servidor");
      setOpenSnackbar(true);
    }
  };


  // Mandar el formulario al servidor dependiendo de la accion del botón
  const handleSubmit = async () => {
    // Registrar usuario
    if (modalActivo === "agregar") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se encontró token en el localStorage");
          return;
        }

        const res = await fetch("http://localhost:5000/api/registrarUsuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          fetchUsuarios();
          setModalActivo(null);

          // Mensajes
          setSeverity("success");
          setMensaje("Usuario agregado");
          setOpenSnackbar(true);
        } else {
          setSeverity("error");
          setMensaje(data.message || "Error");
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error(err);
        setSeverity("error");
        setMensaje("Error de conexión con el servidor");
        setOpenSnackbar(true);
      }
    } // Modificar usuario
    else if (modalActivo === "editar") {
      if (formData.contrasena === formData.confirmarContrasena) {
        // Crear un objeto limpio sin confirmarContrasena
        let dataToSend = { ...formData };
        delete dataToSend.confirmarContrasena;

        // opcional: eliminar campos vacíos
        Object.keys(dataToSend).forEach(key => {
          if (dataToSend[key] === "") delete dataToSend[key];
        });

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No se encontró token en localStorage");
            return;
          }

          const res = await fetch("http://localhost:5000/api/updateUsuario", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dataToSend),
          });
          const data = await res.json();

          if (data.success) {
            fetchUsuarios();
            setModalActivo(null);

            // Mensajes
            setSeverity("success");
            setMensaje("Usuario modificado");
            setOpenSnackbar(true);
          } else {
            setSeverity("error");
            setMensaje(data.message || "Error");
            setOpenSnackbar(true);
          }
        } catch (err) {
          console.error(err);
          setSeverity("error");
          setMensaje("Error de conexión con el servidor");
          setOpenSnackbar(true);
        }
      } else {
        setSeverity("error");
        setMensaje("Contraseñas no coinciden, por favor revisalas");
        setOpenSnackbar(true);
      }
    }
  };

  // Manejar cambios en campos de formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Traer datos de la tabla
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró token en localStorage");
        return;
      }

      const res = await fetch("http://localhost:5000/api/getUsuarios", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json();
      setUsuarios(data.usuarios);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div style={{ padding: 20, textAlign: 'left' }}>
      {/* Titulos de la tabla */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <div >
          <Typography variant="h7" component="h2" color="gray">
            crud_microservicios
          </Typography>
          <Typography variant="h3" component="h2">
            Usuarios
          </Typography>
        </div>
        <Button style={{ maxHeight: 50 }} variant="contained" color="primary" onClick={() => handleOpenModalDinamico("agregar", null)}>
          Agregar Usuario
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} style={{ marginTop: 20, width: "100%" }}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Estado</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id_usuario}>
                <TableCell>{u.id_usuario}</TableCell>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.fecha_registro}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {u.estado === 1 ? (
                    <Button onClick={() => handleOpenModalDinamico("cambiarEstado", u)}>
                      <Chip label="Activo" color="success" variant="outlined" />
                    </Button>
                  ) : (
                    <Button onClick={() => handleOpenModalDinamico("cambiarEstado", u)}>
                      <Chip label="Desactivado" color="error" variant="outlined" />
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenModalDinamico("editar", u)}><BorderColorIcon /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diseño de los modales */}
      {/* Agregar usuario */}
      <Dialog open={modalActivo === "agregar"} onClose={() => setModalActivo(null)}>
        <DialogTitle>Agregar usuario</DialogTitle>
        <DialogContent>
          {formData && (
            <div>
              <TextField
                autoFocus margin="dense" label="Nombre" name="nombre"
                value={formData.nombre} onChange={handleChange}
                fullWidth variant="standard"
              />
              <TextField
                fullWidth variant="standard"
                value={formData.correo} onChange={handleChange}
                margin="dense" label="Correo" name="correo"
              />
              <TextField
                margin="dense" label="Contraseña" name="contrasena" type="password"
                fullWidth variant="standard"
                value={formData.contrasena} onChange={handleChange}
              />
              <TextField
                margin="dense" label="Confirmar contraseña" name="confirmarContrasena" type="password"
                fullWidth variant="standard"
                value={formData.confirmarContrasena} onChange={handleChange}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalActivo(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Agregar usuario</Button>
        </DialogActions>
      </Dialog>

      {/* Editar usuario */}
      <Dialog open={modalActivo === "editar"} onClose={() => setModalActivo(null)}>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && (
            <div>
              {usuarioSeleccionado.estado === 1 ? (
                <Chip label="Activo" color="success" variant="outlined" />
              ) : (
                <Chip label="Desactivado" color="error" variant="outlined" />
              )}
              <TextField
                margin="dense" label="Id" name="id" disabled
                fullWidth variant="standard"
                value={usuarioSeleccionado.id_usuario}
              />
              <TextField
                autoFocus margin="dense" label="Nombre" name="nombre"
                value={formData.nombre} onChange={handleChange}
                fullWidth variant="standard"
              />
              <TextField
                fullWidth variant="standard"
                value={formData.correo} onChange={handleChange}
                margin="dense" label="Correo" name="correo"
              />
              <TextField
                margin="dense" label="Contraseña" name="contrasena" type="password"
                fullWidth variant="standard"
                value={formData.contrasena} onChange={handleChange}
              />
              <TextField
                margin="dense" label="Confirmar contraseña" name="confirmarContrasena" type="password"
                fullWidth variant="standard"
                value={formData.confirmarContrasena} onChange={handleChange}
              />
              <TextField
                margin="dense" label="Fecha de creación" name="fecha" disabled
                fullWidth variant="standard"
                value={usuarioSeleccionado.fecha_registro}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalActivo(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Guardar cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Cambiar estado de usuario */}
      <Dialog open={modalActivo === "cambiarEstado"} onClose={() => setModalActivo(null)}>
        <DialogTitle>¿Deseas cambiar el estado de usuario?</DialogTitle>
        <DialogContent>
          <p>Nuevo estado:</p>
          {usuarioSeleccionado && (
            usuarioSeleccionado.estado === 1 ? (
              <Chip label="Desactivado" color="error" variant="outlined" />
            ) : (
              <Chip label="Activo" color="success" variant="outlined" />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalActivo(null)}>Cancelar</Button>
          {usuarioSeleccionado && (
            <Button
              variant="contained"
              onClick={handleSubmitEstado}>Cambiar estado</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // dura 3 segundos
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: "100%" }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </div>

  );
}
