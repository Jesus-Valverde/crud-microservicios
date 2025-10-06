# MySQL Workbench

This is the script I've use to create the database

## 🗄️ Database design

| Column Name    | Datatype      | Not Null | Primary Key | Unique   |
|----------------|---------------|----------|-------------|----------|
| id_usuario     | INT           | ✅       | ✅         |✅        |
| nombre         | VARCHAR(50)   | ✅       |             |          |
| correo         | VARCHAR(50)   | ✅       |             |✅        |
| contrasena     | VARCHAR(255)  | ✅       |             |          |
| estado         | INT           | ✅       |             |          |
| fecha_registro | TIMESTAMP     | ✅       |             |          |

## Installation

Simply copy and paste into a your MySql workbench script