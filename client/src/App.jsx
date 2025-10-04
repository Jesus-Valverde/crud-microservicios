// React
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import './App.css'
// Componentes del sistema
import UsuariosCrud from "./components/UsuariosCrud";
import ClippedDrawer from "./components/BarraLateral";
import MenuAppBar from "./components/AppHeader";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
// Componentes MUI
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Activar el tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },

});

function App() {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <Routes>
            {/* Default */}
            <Route path="/" element={<Login />} />

            {/* Formulario de login */}
            <Route path="/login" element={<Login />} />

            {/* Selección de base de datos */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <MenuAppBar />
                    <Container maxWidth="sm">
                      <Home />
                    </Container>
                  </Box>
                </ProtectedRoute>
              }
            />

            {/* Muestra la tabla de datos de la base de datos seleccionada: /base de datos/tabla */}
            <Route
              path="/:nombre/:nombre"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <MenuAppBar />
                    <ClippedDrawer />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <UsuariosCrud />
                    </Box>
                  </Box>
                </ProtectedRoute>
              }
            />

            {/* No muestra nada solo la barra lateral para seleccionar tabla de la base de datos*/}
            <Route
              path="/:nombre"
              element={
                <ProtectedRoute>
                  <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%',
                  }}>
                    <CssBaseline />
                    <MenuAppBar />
                    <ClippedDrawer />
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
