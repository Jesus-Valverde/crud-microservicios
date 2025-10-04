import React, { useEffect, useState } from "react";
// Componentes MUI
import {
    Box, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Divider
} from "@mui/material";
// Iconos MUI
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from "./useAuth";

// Tamaño de la barra lateral
const drawerWidth = 240;

export default function ClippedDrawer() {
    const [tablasNombre, setTablas] = useState([]);
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem("usuario")) || null
    );

    useEffect(() => {
        const fetchBarraLateral = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No se encontró token en el localStorage");
                    return;
                }

                // Traer tablas de la DB
                const res = await fetch("http://127.0.0.1:5000/api/getNombreTablas", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error:", errorData);
                    return;
                }

                const data = await res.json();
                setTablas(data.nombreTablas || []);

            } catch (err) {
                console.error("Error al obtener bases de datos:", err);
            }
        };

        fetchBarraLateral();
    }, []);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', justifyContent: 'space-between' },
            }}
        >
            {/* Lista de tablas de la DB */}
            <Box sx={{ overflow: 'auto', textTransform: 'capitalize' }}>
                <Toolbar />
                <List subheader={<ListSubheader>Tablas</ListSubheader>}>
                    {tablasNombre.map((t) => (
                        <ListItem key={t.nombre} disablePadding>
                            <ListItemButton href={'/crud_microservicios/' + t.nombre}>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary={t.nombre} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {/* Información de usuario */}
            <Box sx={{ overflow: 'auto' }}>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={usuario ? usuario.nombre : "¡Bienvenido!"}
                            secondary={usuario ? `ID: ${usuario.id_usuario}` : ""}
                        />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
