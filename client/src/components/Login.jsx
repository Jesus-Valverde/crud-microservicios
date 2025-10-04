import React, { useState } from "react";
import { Button, TextField, Paper, Typography, Snackbar, Alert } from "@mui/material";
import useAuth from "./useAuth";

export default function Login() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("error");

  const { saveToken } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setSeverity("success");
        setMensaje("Inicio de sesión exitoso");
        setOpenSnackbar(true);

        setTimeout(() => window.location.href = "/home", 1000);
      } else {
        setSeverity("error");
        setMensaje(data.message || "Credenciales incorrectas");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setSeverity("error");
      setMensaje("Error de conexión con el servidor");
      setOpenSnackbar(true);
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
      <TextField label="Correo" name="correo" fullWidth margin="normal" onChange={handleChange}/>
      <TextField label="Contraseña" name="contrasena" type="password" fullWidth margin="normal" onChange={handleChange}/>
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Ingresar</Button>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity} sx={{ width: "100%" }}>{mensaje}</Alert>
      </Snackbar>
    </Paper>
  );
}
