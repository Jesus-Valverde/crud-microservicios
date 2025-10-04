import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import StorageIcon from '@mui/icons-material/Storage';

export default function Home() {
    // Información recolectada de base de datos
    const [nombreBasesDatos, setBasesDatos] = useState([]);

    // Traer las bases de datos que hay en el sistema
    useEffect(() => {
        const fetchBasesDatos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No se encontró token en localStorage");
                    return;
                }

                const res = await fetch("http://127.0.0.1:5000/api/getBasesDatos", {
                    method: "GET",
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
                setBasesDatos(data.basesDatos || []);
            } catch (err) {
                console.error("Error al obtener bases de datos:", err);
            }
        };

        fetchBasesDatos();
    }, []);


    return (
        <div style={{ padding: 20 }}>
            {
                nombreBasesDatos.length > 0
                    ? nombreBasesDatos.map((db) => (
                        <Button
                            key={db.nombre}
                            variant="contained"
                            href={db.nombre}
                            style={{ margin: 20 }}
                        >
                            <StorageIcon />
                            {db.nombre}
                        </Button>
                    ))
                    : <p>Cargando bases de datos...</p>
            }
        </div>
    );
}