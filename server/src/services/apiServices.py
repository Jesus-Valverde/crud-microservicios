import mysql.connector
import re
import bcrypt
from src.constants.config import db_config

# ---------------------
# Validaciones
# ---------------------
def es_email_valido(email):
    patron = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(patron, email) is not None

# ---------------------
# Servicio de usuarios
# ---------------------
class usuariosApiService:
    def __init__(self):
        self.db_config = db_config

    def crearConexion(self):
        return mysql.connector.connect(**self.db_config)

    # Obtener usuario por correo
    def getUsuarioByCorreo(self, correo):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        usuario = cursor.fetchone()
        cursor.close()
        conx.close()
        return usuario

    # Login
    def loginUsuario(self, correo, contrasena):
        if not correo or not contrasena:
            return {"success": False, "message": "Correo y contraseña obligatorios"}
        if not es_email_valido(correo):
            return {"success": False, "message": "Correo inválido"}

        usuario = self.getUsuarioByCorreo(correo)
        if not usuario:
            return {"success": False, "message": "Correo o contraseña incorrectos"}

        if usuario.get("estado") == 0:
            return {"success": False, "message": "Usuario desactivado"}

        if bcrypt.checkpw(contrasena.encode(), usuario["contrasena"].encode()):
            usuario_sin_pass = {k: v for k, v in usuario.items() if k != "contrasena"}
            return {"success": True, "message": "Autenticación exitosa", "usuario": usuario_sin_pass}
        else:
            return {"success": False, "message": "Correo o contraseña incorrectos"}

    # Registro
    def registrarUsuario(self, nombre, correo, contrasena):
        if not nombre or not correo or not contrasena:
            return {"success": False, "message": "Todos los campos obligatorios"}
        if not es_email_valido(correo):
            return {"success": False, "message": "Correo inválido"}

        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        if cursor.fetchone():
            cursor.close()
            conx.close()
            return {"success": False, "message": "Correo ya registrado"}

        hashed_pass = bcrypt.hashpw(contrasena.encode(), bcrypt.gensalt()).decode()
        cursor.execute("INSERT INTO usuarios(nombre, correo, contrasena, estado) VALUES (%s,%s,%s,1)", (nombre, correo, hashed_pass))
        conx.commit()
        cursor.close()
        conx.close()
        return {"success": True, "message": "Usuario registrado correctamente"}

    # Obtener todos los usuarios
    def getUsuarios(self):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        rows = cursor.fetchall()
        cursor.close()
        conx.close()
        return {"usuarios": rows}

    # Obtener usuario por ID
    def getUsuarioById(self, id_usuario):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_usuario,))
        row = cursor.fetchone()
        cursor.close()
        conx.close()
        return {"usuario": row}

    # Actualizar usuario
    def updateUsuario(self, id_usuario, nombre=None, correo=None, contrasena=None):
        if not any([nombre, correo, contrasena]):
            return {"success": False, "message": "No se proporcionaron campos para actualizar"}

        if correo and not es_email_valido(correo):
            return {"success": False, "message": "Correo inválido"}

        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)

        if correo:
            cursor.execute("SELECT * FROM usuarios WHERE correo = %s AND id_usuario != %s", (correo, id_usuario))
            if cursor.fetchone():
                cursor.close()
                conx.close()
                return {"success": False, "message": "Correo ya registrado"}

        campos = []
        valores = []

        if nombre: 
            campos.append("nombre = %s")
            valores.append(nombre)
        if correo: 
            campos.append("correo = %s")
            valores.append(correo)
        if contrasena: 
            hashed_pass = bcrypt.hashpw(contrasena.encode(), bcrypt.gensalt()).decode()
            campos.append("contrasena = %s")
            valores.append(hashed_pass)

        valores.append(id_usuario)
        query = f"UPDATE usuarios SET {', '.join(campos)} WHERE id_usuario = %s"
        cursor.execute(query, tuple(valores))
        conx.commit()
        cursor.close()
        conx.close()
        return {"success": True, "message": "Usuario actualizado correctamente"}

    # Cambiar estado
    def cambiarEstadoUsuario(self, id_usuario, nuevo_estado):
        if nuevo_estado not in [0,1]:
            return {"success": False, "message": "Estado inválido"}
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("UPDATE usuarios SET estado = %s WHERE id_usuario = %s", (nuevo_estado, id_usuario))
        conx.commit()
        cursor.close()
        conx.close()
        return {"success": True, "message": "Estado actualizado correctamente"}

# ---------------------
# Servicio de sistema
# ---------------------
class systemApiService:
    def __init__(self):
        self.db_config = db_config

    def crearConexion(self):
        return mysql.connector.connect(**self.db_config)

    def getNombreTablas(self):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT table_name AS nombre FROM information_schema.tables WHERE table_schema = 'crud_microservicios'")
        rows = cursor.fetchall()
        cursor.close()
        conx.close()
        return {"nombreTablas": rows}

    def getBasesDatos(self):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT schema_name AS nombre FROM information_schema.schemata WHERE schema_name NOT IN ('mysql','information_schema','performance_schema','sys')")
        rows = cursor.fetchall()
        cursor.close()
        conx.close()
        return {"basesDatos": rows}
