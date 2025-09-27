import mysql.connector
from src.constants.config import db_config

class usuariosApiService() :

    def __init__(self):
        """Constructor de la clase: Datos de conexion"""
        self.db_config = db_config

    def crearConexion(self):
        """Crea y devuelve la conexion de la DB"""
        return  mysql.connector.connect(**self.db_config)

    def getUsuarios(self):
        conx = self.crearConexion()
        cursor = conx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        rows = cursor.fetchall()
        cursor.close()
        conx.close()
        return {"usuarios": rows}
