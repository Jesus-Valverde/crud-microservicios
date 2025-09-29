import React, { useState } from "react";
import { Button, TextField, Paper, Typography } from "@mui/material";

export default function Login() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.success) { 
      localStorage.setItem("isLoggedIn", "true"); 
      window.location.href = "/usuarios";
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <Paper style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <Typography variant="h5" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Correo"
        name="correo"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Contraseña"
        name="contrasena"
        type="password"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Ingresar
      </Button>
    </Paper>
  );
}
