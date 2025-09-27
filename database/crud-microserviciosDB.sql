CREATE DATABASE crud_microservicios;
USE crud_microservicios;
CREATE table usuarios (
	id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR (255) NOT NULL,
    estado INT DEFAULT 1 NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT (NOW())
) ;
INSERT INTO usuarios(nombre, correo, contraseña)
VALUES 
('Jesus Valverde', 'jesval@gmail.com', '12345');
