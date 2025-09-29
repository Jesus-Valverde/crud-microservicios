import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsuariosCrud from "./components/UsuariosCrud";
import ClippedDrawer from "./components/BarraLateral";
import MenuAppBar from "./components/AppHeader";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppBar, Toolbar, Button } from "@mui/material";

import './App.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [count, setCount] = useState(0)

  /* Prueba de conexion entre el backend y frontend */
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/getUsuarios")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <>

      <ThemeProvider theme={darkTheme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  {/* container de la App */}
                  <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    {/* Header */}
                    <MenuAppBar />
                    {/* Barra lateral */}
                    <ClippedDrawer />
                    {/* CRUD */}
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <UsuariosCrud />
                    </Box>
                  </Box>

                </ProtectedRoute>
              }
            />

            {/* Default */}
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
