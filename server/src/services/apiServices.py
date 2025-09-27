import mysql.connector
from src.constants.config import db_config

class usuariosApiService() :

    def __init__(self):
        """Constructor de la clase: Datos de conexion"""
        self.db_config = db_config

    def crearConexion(self):
        """Crea y devuelve la conexion de la DB"""
        return  mysql.connector.connect(**self.db_config)

    def autenticarUsuario(self, correoParam, contrasenaParam):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
        cursor.execute(query, (correoParam, contrasenaParam))
        usuario = cursor.fetchone()
        cursor.close()
        conx.close()
        if usuario:
            return {"message": "Autenticación exitosa", "usuario": usuario}
        else:
            return {"message": "Correo o contraseña incorrectos", "usuario": None}

    def registrarUsuario(self, nombreParam, correoParam, contrasenaParam):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        query = "INSERT INTO usuarios(nombre, correo, contrasena) VALUES (%s, %s, %s)"
        valores = (nombreParam, correoParam, contrasenaParam)
        cursor.execute(query, valores)
        conx.commit()
        cursor.close()
        conx.close()
        return {"message": "Usuario registrado correctamente"}

    def getUsuarios(self):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        rows = cursor.fetchall()
        cursor.close()
        conx.close()
        return {"usuarios": rows}

    def getUsuarioById(self, idParam):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE id_usuario = %s;"
        cursor.execute(query, (idParam,))
        row = cursor.fetchone()
        cursor.close()
        conx.close()
        return {"usuario": row}

    def updateUsuario(self, idParam, nombreParam = None, correoParam = None, contrasenaParam = None):
        """
        Solo se actualizarán los campos que no sean None.
        """
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        
        campos = []
        valores = []
        if nombreParam is not None:
            campos.append("nombre = %s")
            valores.append(nombreParam)
        if correoParam is not None:
            campos.append("correo = %s")
            valores.append(correoParam)
        if contrasenaParam is not None:
            campos.append("contrasena = %s")
            valores.append(contrasenaParam)

        if not campos:
            return {"message": "No se proporcionaron campos para actualizar"}

        valores.append(idParam)  # último valor: ID para el WHERE

        query = f"UPDATE usuarios SET {', '.join(campos)} WHERE id_usuario = %s"
        cursor.execute(query, tuple(valores))
        conx.commit()
        cursor.close()
        conx.close()
        return {"message": "Usuario actualizado correctamente"}

    def cambiarEstadoUsuario(self, idParam, nuevoEstado):
        """
        Cambia el estado de un usuario.
        nuevoEstado = 1 → activo, 0 → inactivo
        """
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        query = "UPDATE usuarios SET estado = %s WHERE id_usuario = %s"
        cursor.execute(query, (nuevoEstado, idParam))
        conx.commit()
        cursor.close()
        conx.close()
        return {"message": f"Estado del usuario actualizado a {nuevoEstado}"}