import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";

export default function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "", contrasena: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/getUsuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data.usuarios || []));
  }, []);

  // 🔹 Abrir modal
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 🔹 Manejar formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Registrar usuario
  const handleSubmit = () => {
    fetch("http://localhost:5000/api/registrarUsuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setOpen(false);
        setFormData({ nombre: "", correo: "", contrasena: "" });
        // recargar usuarios
        fetch("http://localhost:5000/api/getUsuarios")
          .then(res => res.json())
          .then(data => setUsuarios(data.usuarios || []));
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Usuarios</h2>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Agregar Usuario
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper} style={{ marginTop: 20, width: "100%" }}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id_usuario}>
                <TableCell>{u.id_usuario}</TableCell>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.fecha_registro}</TableCell>
                <TableCell>{u.estado}</TableCell>
                <TableCell>
                  <Button color="secondary">Editar</Button>
                  <Button color="error">Cambiar estado</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registrar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Nombre" name="nombre"
            fullWidth variant="standard" value={formData.nombre} onChange={handleChange}
          />
          <TextField
            margin="dense" label="Correo" name="correo"
            fullWidth variant="standard" value={formData.correo} onChange={handleChange}
          />
          <TextField
            margin="dense" label="Contraseña" name="contrasena" type="password"
            fullWidth variant="standard" value={formData.contrasena} onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
