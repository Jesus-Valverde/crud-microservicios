#Este es el código intermediario entre en servidor y el frontend
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from src.constants.config import db_config

app = Flask(__name__)
CORS(app) #Habilitar CORS en todas las rutas

@app.route("/")
def hello_world():
    return jsonify({"hola mundo": "Archivo inicial - API funcionando con Flask"})

# Prueba para verificar conexion en el servidor
@app.route("/api/usuarios")
def get_users():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"usuarios": rows}

if __name__ == '__main__':
    app.run(debug=True) # Flask corre en el puerto 5000 por defecto